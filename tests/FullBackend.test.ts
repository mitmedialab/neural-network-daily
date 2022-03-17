import util from 'util';
import { deepToString, range, waitForCondition } from "shared/common/utils";
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
import TContourSelection from 'shared/contours/TContourSelection';
import EImageClassification from 'shared/enums/EImageClassification';

describe("Full Backend", () => {
  const capacities = [6, 7, 8, 9, 10, 11, 12];
  let factory: GraphFactory;
  let testServer: TestingServer;
  let socketServer: GenericServer<TCombined>;
  const _n: string = "dummyName";

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
    await waitForCondition(() => getTotalNumberOfSockets(socketServer) === 0);
    let socketServerClosed = false;
    socketServer.close(() => { socketServerClosed = true; });
    testServer.close();
    await waitForCondition(() => socketServerClosed);
  })

  test.each(capacities)("Room Management", async (capacity: number) => {
    const [facilitatorSocket, studentSocket] = await getSockets(2);
    expect(getTotalNumberOfSockets(socketServer)).toBe(2);

    const room = await startRoom(facilitatorSocket, capacity);
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

  test.each(capacities)("Room Joining", async (capacity: number) => {
    const validateResponse = (response: TJoinRoomResponse) => {
      expect(response.success).toBe(true);
      expect(response.onSuccess?.assignment.indexWithinLayer).not.toBe(undefined);
      expect(response.onSuccess?.assignment.layer).not.toBe(undefined);
    };

    const confirmFailure = (response: TJoinRoomResponse, reason: EJoinRoomFailure) => {
      expect(response.success).toBe(false);
      expect(response.failure).toBe(reason);
    }

    const config = factory.getConfig(capacity);
    const sockets: ClientSocketWrapper<any>[] = await getSockets(capacity + 1);

    const facilitatorSocket: ClientSocketWrapper<any> = sockets[0];
    const studentSockets: ClientSocketWrapper<any>[] = sockets.filter((_, index) => index > 0);

    expect(getTotalNumberOfSockets(socketServer)).toBe(capacity + 1);

    const room = await startRoom(facilitatorSocket, capacity);

    let count = 0;
    for (const [layer, layerConfig] of factory.getLayerConfigMap(config)) {
      for (let indexWithinLayer = 0; indexWithinLayer < layerConfig.nodeCount; indexWithinLayer++) {
        let joined = false;
        const studentSocket = studentSockets.pop() as ClientSocketWrapper<any>;
        studentSocket.send("joinRoom", [room, _n, (response: TJoinRoomResponse) => {
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
    doomedSocket.send("joinRoom", [room, _n, (response: TJoinRoomResponse) => {
      confirmFailure(response, EJoinRoomFailure.RoomAtCapacity);
      badCapacityAttempt = true;
    }]);

    let badRoomAttempt = false;
    doomedSocket.send("joinRoom", ["-1", _n, (response: TJoinRoomResponse) => {
      confirmFailure(response, EJoinRoomFailure.NoSuchRoom);
      badRoomAttempt = true;
    }]);

    await Promise.all([waitForCondition(() => badCapacityAttempt), waitForCondition(() => badRoomAttempt)]);

    expect(getSizeOfRoom(socketServer, room)).toBe(capacity + 1);
    expect(getTotalNumberOfSockets(socketServer)).toBe(capacity + 2);
    doomedSocket.close();

    sockets.forEach(socket => socket.close());
    const roomToZero = (): boolean => getSizeOfRoom(socketServer, room) === 0;
    const roomDestroyed = (): boolean => !roomExists(socketServer, room);
    const noMoreSockets = (): boolean => getTotalNumberOfSockets(socketServer) === 0;

    await waitForCondition(() => roomToZero() && roomDestroyed() && noMoreSockets());
  }, 5000);

  const getContourData = (indexWithinLayer: number, config: TGraphConfig): TContour[] => {
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

  const getContourSelectionData = (nodeInfo: TLayerInfo, config: TGraphConfig): TContourSelection[] => {
    return [];
  }

  test.each(capacities)("Data Sending", async (capacity: number) => {
    const factory = new GraphFactory();
    const config = factory.getConfig(capacity);
    const sockets: ClientSocketWrapper<any>[] = await getSockets(capacity + 1);
    const facilitatorSocket: ClientSocketWrapper<any> = sockets[0];
    const studentSockets: ClientSocketWrapper<any>[] = sockets.filter((_, index) => index > 0);

    type TFakeStudent = {
      node?: C2CNode<TCombined, TCombined>;
      socket: ClientSocketWrapper<TCombined>;
      receivedCount: number;
      prediction?: EImageClassification;
    }

    const room = await startRoom(facilitatorSocket, capacity);

    const students: TFakeStudent[] = studentSockets.map(socket => {
      const self: TFakeStudent = { socket, node: undefined, receivedCount: 0 };
      socket.send("joinRoom", [room, _n, (response: TJoinRoomResponse) => {
        expect(response.success).toBe(true);
        self.node = factory.buildNodeForGraph(config, toInfo(response));
      }]);
      return self;
    });

    await waitForCondition(() => !students.some(student => student.node === undefined));

    const studentGraph = new Map<EParticipantRole, TFakeStudent[]>();
    factory.layers.filter(layer => config[layer]).forEach(layer => {
      type TNode = TLayerInfo;
      const sorter = (a: TFakeStudent, b: TFakeStudent) => (a.node as TNode).indexWithinLayer - (b.node as TNode).indexWithinLayer;
      studentGraph.set(layer, students.filter(student => student.node?.layer === layer).sort(sorter));
    });

    let currentSendingLayer = EParticipantRole.InputLayer;
    let currentReceivingLayer = EParticipantRole.HiddenLayer1;

    const getWaitingCondition = (): Promise<void>[] => {
      const sendingNodesCount = studentGraph.get(currentSendingLayer)?.length as number;
      return Array.from(studentGraph.values()).flat().map(student => {
        return waitForCondition((): boolean => {
          const expected = student.node?.layer === currentSendingLayer ? sendingNodesCount - 1 : sendingNodesCount;
          return student.receivedCount === expected;
        });
      });
    }

    for (const students of studentGraph.values()) {
      for (const student of students) {
        student.socket.on("update", (data: TDataPacket<TCombined>) => {
          student.receivedCount++;
          student.node?.trySetInput(data);
        });
        student.socket.on("prediction", (packet: TDataPacket<TCombined>) => {
          student.prediction = packet.data[0] as EImageClassification;
        });
      }
    }

    type TIterableLayer = IterableIterator<[number, TFakeStudent]>;

    const inputNodes = studentGraph.get(currentSendingLayer)?.entries() as TIterableLayer;
    for (const [index, student] of inputNodes) {
      const info: TLayerInfo = { layer: currentSendingLayer, indexWithinLayer: index };
      const data: TContour[] = getContourData(index, config);
      student.socket.send("propogate", [{ info, data }]);
    }

    await Promise.all(getWaitingCondition());

    const reset = () => {
      for (const students of studentGraph.values()) {
        students.forEach(student => student.receivedCount = 0);
      }
    }

    reset();

    const { nodeCount } = config[currentSendingLayer] as TLayerConfig;
    const inputNodeIndexes = Array.from<number>(range(0, nodeCount));
    const contourByInputNode: TContour[][] = inputNodeIndexes.map(nodeIndex => getContourData(nodeIndex, config));
    for (const [index, hiddenLayer1Student] of studentGraph.get(currentReceivingLayer)?.entries() as TIterableLayer) {
      expect(hiddenLayer1Student.node?.input).toEqual(contourByInputNode.map(contours => contours[index]));
    }

    currentSendingLayer = currentReceivingLayer;
    expect(currentSendingLayer).toBe(EParticipantRole.HiddenLayer1);

    currentReceivingLayer = factory.getNextLayer(config, { layer: currentReceivingLayer, indexWithinLayer: -1 });
    expect(currentReceivingLayer === EParticipantRole.HiddenLayer2 || currentReceivingLayer === EParticipantRole.OutputLayer).toBe(true);

    const hiddenLayer1Nodes = studentGraph.get(currentSendingLayer)?.entries() as TIterableLayer;
    for (const [index, student] of hiddenLayer1Nodes) {
      const info: TLayerInfo = { layer: currentSendingLayer, indexWithinLayer: index };
      const data: TContourSelection[] = [{
        contours: (student.node?.input as TContour[]).slice(0, config[currentSendingLayer]?.contourOuputWidth),
        selector: info,
      }];
      student.socket.send("propogate", [{ info, data }]);
    }

    await Promise.all(getWaitingCondition());

    reset();

    const receivingNodes = studentGraph.get(currentReceivingLayer)?.entries() as TIterableLayer;
    for (const [_, receivingStudent] of receivingNodes) {
      const input: TContourSelection[] = receivingStudent.node?.input as TContourSelection[];
      expect(input.length).toBe(config[currentSendingLayer]?.nodeCount);
      input.forEach((selection, index) => {
        expect(selection.selector).toEqual({ layer: currentSendingLayer, indexWithinLayer: index });
        const previousContourWidth: number = config[currentSendingLayer]?.contourOuputWidth as number;
        expect(selection.contours.length).toBe(previousContourWidth);
        const inputLayerContourWidth: number = config[EParticipantRole.InputLayer]?.contourOuputWidth as number;
        const expectedCountours: TContour[] = Array.from<number>(range(index, previousContourWidth, inputLayerContourWidth)).map<TContour>((value, index) => {
          return {
            author: { layer: EParticipantRole.InputLayer, indexWithinLayer: index },
            path: [{ x: value, y: value }]
          };
        });
        expect(selection.contours).toEqual(expectedCountours);
      });
    }

    const outputLayerNodes = (studentGraph.get(EParticipantRole.OutputLayer) as TFakeStudent[]);
    expect(outputLayerNodes.length).toBe(1);
    const outputNode = outputLayerNodes[0];

    if (currentReceivingLayer != EParticipantRole.OutputLayer) {
      currentSendingLayer = currentReceivingLayer;
      expect(currentSendingLayer).toBe(EParticipantRole.HiddenLayer2);

      currentReceivingLayer = factory.getNextLayer(config, { layer: currentReceivingLayer, indexWithinLayer: -1 });
      expect(currentReceivingLayer).toBe(EParticipantRole.OutputLayer);

      const hiddenLayer2Nodes = studentGraph.get(currentSendingLayer)?.entries() as TIterableLayer;
      for (const [index, student] of hiddenLayer2Nodes) {
        const info: TLayerInfo = { layer: currentSendingLayer, indexWithinLayer: index };
        const contours: TContour[] = [];
        (student.node?.input as TContourSelection[]).forEach(selection => contours.push(...selection.contours));
        const data: TContourSelection[] = [{
          contours: contours.slice(0, config[currentSendingLayer]?.contourOuputWidth),
          selector: info,
        }];
        student.socket.send("propogate", [{ info, data }]);
      }

      await Promise.all(getWaitingCondition());

      expect(outputNode.node?.input.length).toBe(config[currentSendingLayer]?.nodeCount);
      const expectedCountourCount = 4;
      let actualCountourCount = 0;
      (outputNode.node?.input as TContourSelection[]).forEach(selection => actualCountourCount += selection.contours.length);
      expect(actualCountourCount).toBe(expectedCountourCount);
    }

    const prediction = EImageClassification.Cat;
    outputNode.socket.send("propogate", [{
      info: { layer: EParticipantRole.OutputLayer, indexWithinLayer: 0 },
      data: [prediction]
    }]);

    await Promise.all(Array.from(studentGraph.values()).flat().map(student => {
      waitForCondition(() => {
        if (student.node?.layer === EParticipantRole.OutputLayer) return true;
        return student.prediction === prediction;
      });
    }));

    sockets.forEach(socket => socket.close());
  }, 10000);
})