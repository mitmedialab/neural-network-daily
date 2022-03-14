import util from 'util';
import { deepToString, waitForCondition } from "shared/common/utils";
import TContour, { TCoordinate } from "shared/contours/TContour";
import { TGraphConfig, TGraphMap, TLayerConfig } from "shared/graph/graphConfigs";
import GraphFactory from "shared/graph/GraphFactory";
import { TCombined } from "shared/graph/inputOutputs";
import ClientSocketWrapper from "shared/sockets/ClientSocketWrapper";
import { EJoinRoomFailure, GenericServer, TJoinRoomResponse, toInfo } from "shared/sockets/socketEvents";
import { TestingServer } from "utils";
import EParticipantRole from "../shared/enums/EParticipantRole";
import C2CNode, { TDataPacket, TLayerInfo } from "../shared/graph/C2CNode";
import establishSocketServer, { getSizeOfRoom, getTotalNumberOfSockets, roomExists } from "./shared/sockets/socketManagement";

describe("Full Backend", () => {
  let factory: GraphFactory;
  let testServer: TestingServer;
  let socketServer: GenericServer<TCombined>;

  const getSocket = async (): Promise<ClientSocketWrapper<any>> => {
    let ready = false;
    const url = testServer.url;
    const config = { url, onConnect: () => { ready = true; } };
    const socket = ClientSocketWrapper.Connect<any>(config);
    await waitForCondition(() => ready);
    return socket;
  };

  const getSockets = async (count: number): Promise<ClientSocketWrapper<any>[]> => {
    const sockets: Promise<ClientSocketWrapper<any>>[] = Array.apply(null, Array(count)).map(_ => getSocket());
    return Promise.all(sockets);
  }

  const startRoom = async (socket: ClientSocketWrapper<any>, capacity: number): Promise<string> => {
    const badRoomId = "-1";
    let room = badRoomId;
    socket.send("startRoom", [capacity, (roomId: string) => {
      room = roomId;
    }]);
    await waitForCondition(() => room !== badRoomId);
    return room;
  }

  beforeAll(() => {
    factory = new GraphFactory();
    testServer = new TestingServer();
    socketServer = establishSocketServer(testServer.httpsServer);
  });

  afterAll(async () => {
    //await waitForCondition(() => getTotalNumberOfSockets(socketServer) === 0);
    socketServer.close();
    testServer.close();
  })

  test("Room Management", async () => {
    const [facilitatorSocket, studentSocket] = await getSockets(2);
    expect(getTotalNumberOfSockets(socketServer)).toBe(2);

    const room = await startRoom(facilitatorSocket, 6);
    expect(roomExists(socketServer, room)).toBe(true);
    expect(getSizeOfRoom(socketServer, room)).toBe(1);

    let checkFinished = false;
    studentSocket.send("checkRoom", ["-1", (success: boolean) => {
      expect(success).toBe(false);
      checkFinished = true;
    }]);

    await waitForCondition(() => checkFinished);

    checkFinished = false;
    studentSocket.send("checkRoom", [room, (success: boolean) => {
      expect(success).toBe(true);
      checkFinished = true;
    }]);

    await waitForCondition(() => checkFinished);

    studentSocket.close();
    facilitatorSocket.close();

    await waitForCondition(() => getSizeOfRoom(socketServer, room) === 0);
    expect(roomExists(socketServer, room)).toBe(false);
  });

  test("Room Joining", async () => {
    const validateResponse = (response: TJoinRoomResponse) => {
      expect(response.success).toBe(true);
      expect(response.indexWithinLayer).not.toBe(undefined);
      expect(response.layer).not.toBe(undefined);
    };

    const confirmFailure = (response: TJoinRoomResponse, reason: EJoinRoomFailure) => {
      expect(response.success).toBe(false);
      expect(response.failure).toBe(reason);
    }

    const roomCapacity = 6;
    const config = factory.getConfig(roomCapacity);
    const sockets: ClientSocketWrapper<any>[] = await getSockets(roomCapacity + 1);

    const facilitatorSocket: ClientSocketWrapper<any> = sockets[0];
    const studentSockets: ClientSocketWrapper<any>[] = sockets.filter((_, index) => index > 0);

    expect(getTotalNumberOfSockets(socketServer)).toBe(roomCapacity + 1);

    const room = await startRoom(facilitatorSocket, roomCapacity);

    let count = 0;
    for (const [layer, layerConfig] of factory.getLayerConfigMap(config)) {
      for (let indexWithinLayer = 0; indexWithinLayer < layerConfig.nodeCount; indexWithinLayer++) {
        let joined = false;
        const studentSocket = studentSockets.pop() as ClientSocketWrapper<any>;
        studentSocket.send("joinRoom", [room, (response: TJoinRoomResponse) => {
          validateResponse(response);
          expect(toInfo(response)).toEqual({ layer, indexWithinLayer } as TLayerInfo);
          joined = true;
        }]);
        await waitForCondition(() => joined);
        expect(getSizeOfRoom(socketServer, room)).toBe(1 + (indexWithinLayer + 1 + count));
      }
      count += layerConfig.nodeCount;
    }

    const doomedSocket = await getSocket();

    let badCapacityAttempt = false;
    doomedSocket.send("joinRoom", [room, (response: TJoinRoomResponse) => {
      confirmFailure(response, EJoinRoomFailure.RoomAtCapacity);
      badCapacityAttempt = true;
    }]);

    let badRoomAttempt = false;
    doomedSocket.send("joinRoom", ["-1", (response: TJoinRoomResponse) => {
      confirmFailure(response, EJoinRoomFailure.NoSuchRoom);
      badRoomAttempt = true;
    }]);

    await Promise.all([waitForCondition(() => badCapacityAttempt), waitForCondition(() => badRoomAttempt)]);

    expect(getSizeOfRoom(socketServer, room)).toBe(roomCapacity + 1);
    expect(getTotalNumberOfSockets(socketServer)).toBe(roomCapacity + 2);
    doomedSocket.close();

    sockets.forEach(socket => socket.close());
    const roomToZero = (): boolean => getSizeOfRoom(socketServer, room) === 0;
    const roomDestroyed = (): boolean => !roomExists(socketServer, room);
    const noMoreSockets = (): boolean => getTotalNumberOfSockets(socketServer) === 0;

    await waitForCondition(() => roomToZero() && roomDestroyed() && noMoreSockets());
  }, 2000);

  test("Data Sending", async () => {
    const factory = new GraphFactory();
    const roomCapacity = 6;
    const config = factory.getConfig(roomCapacity);
    const sockets: ClientSocketWrapper<any>[] = await getSockets(roomCapacity + 1);
    const facilitatorSocket: ClientSocketWrapper<any> = sockets[0];
    const studentSockets: ClientSocketWrapper<any>[] = sockets.filter((_, index) => index > 0);
    type TFakeStudent = {
      node?: C2CNode<TCombined, TCombined>;
      socket: ClientSocketWrapper<TCombined>;
      receivedCount: number;
    }

    const room = await startRoom(facilitatorSocket, roomCapacity);

    const students: TFakeStudent[] = studentSockets.map(socket => {
      const self: TFakeStudent = { socket, node: undefined, receivedCount: 0 };
      socket.send("joinRoom", [room, (response: TJoinRoomResponse) => {
        expect(response.success).toBe(true);
        self.node = factory.buildNodeForGraph(config, toInfo(response));
      }]);
      return self;
    });

    await waitForCondition(() => !students.some(student => student.node === undefined));
    const studentGraph = new Map<EParticipantRole, TFakeStudent[]>();
    factory.layers.filter(layer => config[layer]).forEach(layer => {
      const sorter = (a: TFakeStudent, b: TFakeStudent) => (a.node as TLayerInfo).indexWithinLayer - (b.node as TLayerInfo).indexWithinLayer;
      studentGraph.set(layer, students.filter(student => student.node?.layer === layer).sort(sorter));
    });

    const reset = () => {
      Array.from(studentGraph.values()).forEach(students => {
        students.forEach(student => {
          student.receivedCount = 0;
        });
      });
    }

    let currentSendingLayer = EParticipantRole.InputLayer;
    let currentReceivingLayer = EParticipantRole.HiddenLayer1;

    const getWaitingCondition = (): Promise<void>[] => {
      const sendingNodesCount = studentGraph.get(currentSendingLayer)?.length as number;
      const waitingConditions = Array<Promise<void>>();
      Array.from(studentGraph.values()).forEach(students => {
        students.forEach(student => {
          waitingConditions.push(waitForCondition((): boolean => {
            const expected = student.node?.layer === currentSendingLayer ? sendingNodesCount - 1 : sendingNodesCount;
            return student.receivedCount === expected;
          }));
        });
      });
      return waitingConditions;
    }

    for (const students of studentGraph.values()) {
      for (const student of students) {
        student.socket.on("update", (data: TDataPacket<TCombined>) => {
          student.receivedCount++;
          student.node?.trySetInput(data);
        });
      }
    }

    const getContourData = (indexWithinLayer: number): TContour[] => {
      const author = { layer: EParticipantRole.InputLayer, indexWithinLayer };
      const nextNodeCount = (config[EParticipantRole.HiddenLayer1] as TLayerConfig).nodeCount;
      const contours: TContour[] = [];
      for (let i = 0; i < nextNodeCount; i++) {
        const value = indexWithinLayer * nextNodeCount + i;
        const path: TCoordinate[] = [{ x: value, y: value }];
        const contour: TContour = { author, path };
        contours.push(contour);
      }
      return contours;
    }

    const inputs = studentGraph.get(EParticipantRole.InputLayer)?.entries() as IterableIterator<[number, TFakeStudent]>;
    for (const [index, student] of inputs) {
      const info: TLayerInfo = { layer: EParticipantRole.InputLayer, indexWithinLayer: index };
      const data: TContour[] = getContourData(index);
      student.socket.send("propogate", [{ info, data }]);
    }

    await Promise.all(getWaitingCondition());
    reset();

    const nodes = Array.from(studentGraph.values()).map(students => students.map(student => student.node));

    Array.from(studentGraph.entries()).forEach(([layer, students]) => {
      const contourByNode: TContour[][] = Array.from(Array(config[EParticipantRole.InputLayer]?.nodeCount).keys()).map(nodeIndex => getContourData(nodeIndex));
      if (layer === EParticipantRole.HiddenLayer1) {
        students.forEach((student, index) => {
          expect(student.node?.input).toEqual(contourByNode.map(contours => contours[index]));
        })
      }
    });

    //const node = factory.buildNodeForGraph(config,);//
    // also need nodes
  }, 10000);
})