import { waitForCondition } from "shared/common/utils";
import { TGraphConfig, TGraphMap } from "shared/graph/graphConfigs";
import GraphFactory from "shared/graph/GraphFactory";
import { TCombined } from "shared/graph/inputOutputs";
import ClientSocketWrapper from "shared/sockets/ClientSocketWrapper";
import { EJoinRoomFailure, GenericServer, TJoinRoomResponse, toInfo } from "shared/sockets/socketEvents";
import { TestingServer } from "utils";
import EParticipantRole from "../shared/enums/EParticipantRole";
import C2CNode, { TLayerInfo } from "../shared/graph/C2CNode";
import establishSocketServer, { getSizeOfRoom, getTotalNumberOfSockets, roomExists } from "./shared/sockets/socketManagement";

describe("Full Backend", () => {
  let testServer: TestingServer;
  let socketServer: GenericServer<TCombined>;
  let facilitatorClientSocket: ClientSocketWrapper<TCombined>;
  let studentClientSockets: ClientSocketWrapper<TCombined>[];
  let studentNodes: TLayerInfo[];
  let room: string;
  let capacity: number = 6;

  beforeAll(() => {
    testServer = new TestingServer();
    socketServer = establishSocketServer(testServer.httpsServer);
    studentClientSockets = [];
    studentNodes = [];
  });

  afterAll(async () => {
    facilitatorClientSocket?.close();
    studentClientSockets.forEach(sock => sock?.close());
    await waitForCondition(() => !roomExists(socketServer, room));
    await waitForCondition(() => getTotalNumberOfSockets(socketServer) === 0);
    socketServer.close();
    testServer.close();
  })

  test("Room Management", async () => {
    let facilitatorReady: boolean = false;
    let studentReady: boolean = false;
    facilitatorClientSocket = ClientSocketWrapper.Connect<any>({
      url: testServer.url,
      onConnect: () => {
        facilitatorReady = true;
      }
    });
    const studentSocket = ClientSocketWrapper.Connect<any>({
      url: testServer.url,
      onConnect: () => {
        studentReady = true;
      }
    });
    studentClientSockets.push(studentSocket);

    await waitForCondition(() => studentReady && facilitatorReady);

    expect(getTotalNumberOfSockets(socketServer)).toBe(2);

    const badRoomId = "-1";
    room = badRoomId;
    facilitatorClientSocket.send("startRoom", [capacity, (roomId: string) => {
      room = roomId;
    }]);

    await waitForCondition(() => room !== badRoomId);

    expect(roomExists(socketServer, room)).toBe(true);
    expect(getSizeOfRoom(socketServer, room)).toBe(1);

    let checkFinished = false;
    studentSocket.send("checkRoom", [badRoomId, (success: boolean) => {
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
  });

  test("Room Joining", async () => {
    const validateResponse = (response: TJoinRoomResponse) => {
      expect(response.success).toBe(true);
      expect(response.indexWithinLayer).not.toBe(undefined);
      expect(response.layer).not.toBe(undefined);
    };

    expect(getSizeOfRoom(socketServer, room)).toBe(1);

    let firstJoined = false;
    // using socket from previous test
    studentClientSockets[0].send("joinRoom", [room, (response: TJoinRoomResponse) => {
      validateResponse(response);
      const info = toInfo(response);
      expect(info.layer).toBe(EParticipantRole.InputLayer);
      expect(info.indexWithinLayer).toBe(0);
      firstJoined = true;
      studentNodes.push(info);
    }]);

    await waitForCondition(() => firstJoined);

    // 1 facilitator + 1 student
    expect(getSizeOfRoom(socketServer, room)).toBe(2);
    const remainingPositions = capacity - 1;

    let tasks: Promise<void>[] = [];
    for (let i = 0; i < remainingPositions; i++) {
      let joined = false;
      const studentSocket = ClientSocketWrapper.Connect<any>({
        url: testServer.url,
        onConnect: () => {
          studentSocket.send("joinRoom", [room, (response: TJoinRoomResponse) => {
            validateResponse(response);
            studentNodes.push(toInfo(response));
            joined = true;
          }]);
        }
      });
      studentClientSockets.push(studentSocket);
      tasks.push(waitForCondition(() => joined));
    }

    await Promise.all(tasks);

    expect(getSizeOfRoom(socketServer, room)).toBe(capacity + 1);
    expect(getTotalNumberOfSockets(socketServer)).toBe(capacity + 1);

    const confirmFailure = (response: TJoinRoomResponse, reason: EJoinRoomFailure) => {
      expect(response.success).toBe(false);
      expect(response.failure).toBe(reason);
    }

    let badCapacityAttempt = false;
    let badRoomAttempt = false;
    const doomedSocket = ClientSocketWrapper.Connect<any>({
      url: testServer.url,
      onConnect: () => {
        doomedSocket.send("joinRoom", [room, (response: TJoinRoomResponse) => {
          confirmFailure(response, EJoinRoomFailure.RoomAtCapacity);
          badCapacityAttempt = true;
        }]);
        doomedSocket.send("joinRoom", ["-1", (response: TJoinRoomResponse) => {
          confirmFailure(response, EJoinRoomFailure.NoSuchRoom);
          badRoomAttempt = true;
        }]);
      }
    });
    await Promise.all([waitForCondition(() => badCapacityAttempt), waitForCondition(() => badRoomAttempt)]);

    expect(getSizeOfRoom(socketServer, room)).toBe(capacity + 1);
    expect(getTotalNumberOfSockets(socketServer)).toBe(capacity + 2);

    doomedSocket.close();

    // not actually random, based on the limits of this algorithm -- but good enough for this!
    const getPsuedoRandomOrder = (length: number) => {
      return Array.from(Array(length).keys()).sort(() => 0.5 - Math.random());
    }

    const confirmRoomCount = async (room: string, count: number) => {
      let completed = false;
      facilitatorClientSocket.send("testing_getRoomCounts", [(map) => {
        expect(map[room]).toBe(count);
        completed = true;
      }]);
      await waitForCondition(() => completed);
    }

    for (const index of getPsuedoRandomOrder(capacity)) {
      const roomSizeBefore = getSizeOfRoom(socketServer, room);
      studentClientSockets[index].close();
      const info = studentNodes[index];
      await waitForCondition(() => getSizeOfRoom(socketServer, room) === roomSizeBefore - 1);
      await confirmRoomCount(room, capacity - 1);
      let connected = false;
      studentClientSockets[index] = ClientSocketWrapper.Connect({ url: testServer.url, onConnect: () => connected = true });
      await waitForCondition(() => connected);
      let joined = false;
      studentClientSockets[index].send("joinRoom", [room, (response: TJoinRoomResponse) => {
        expect(toInfo(response)).toEqual(info);
        joined = true;
      }]);
      await waitForCondition(() => joined);
      await confirmRoomCount(room, capacity);
    }
  }, 10000);

  test("Data Sending", () => {
    expect(studentNodes.length).toBe(studentClientSockets.length);

    const factory = new GraphFactory();
    const config = factory.getConfig(capacity);
    const socketGraph = new Map<EParticipantRole, Map<number, ClientSocketWrapper<TCombined>>>();

    factory.layers.filter(layer => config[layer]).forEach(layer => {
      const mapForLayer = new Map<number, ClientSocketWrapper<TCombined>>();
      studentNodes.filter(node => node.layer === layer).forEach((node, index) => {
        mapForLayer.set(node.indexWithinLayer, studentClientSockets[index]);
      });
      socketGraph.set(layer, mapForLayer);
    });

    const sockets = Array.from(socketGraph.values()).map(item => Array.from(item.values()));
    const node = factory.buildNodeForGraph(config,);//
    // also need nodes
  });
})