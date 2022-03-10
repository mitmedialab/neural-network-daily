import { createServer, Server as httpServer } from "http";
import { waitForCondition } from "shared/common/utils";
import { TCombined } from "shared/graph/inputOutputs";
import ClientSocketWrapper from "shared/sockets/ClientSocketWrapper";
import { EJoinRoomFailure, GenericServer, TJoinRoomResponse, toInfo } from "shared/sockets/socketEvents";
import { TestingServer } from "utils";
import EParticipantRole from "../shared/enums/EParticipantRole";
import { TGraphConfig } from "./shared/graph/graphConfigs";
import GraphFactory from "./shared/graph/GraphFactory"
import establishSocketServer, { getSizeOfRoom, getTotalNumberOfSockets } from "./shared/sockets/socketManagement";

describe("Full Backend", () => {
  let testServer: TestingServer;
  let socketServer: GenericServer<TCombined>;
  let facilitatorClientSocket: ClientSocketWrapper<TCombined>;
  let studentClientSockets: ClientSocketWrapper<TCombined>[];
  let room: string;
  let capacity: number;

  beforeAll(() => {
    testServer = new TestingServer();
    socketServer = establishSocketServer(testServer.httpsServer);
    studentClientSockets = [];
  });

  afterAll(() => {
    facilitatorClientSocket?.close();
    studentClientSockets.forEach(sock => sock?.close());
    socketServer.close();
    testServer.close();
  })

  test("Room Management", async () => {
    let facilitatorReady: boolean = false;
    let studentReady: boolean = false;
    facilitatorClientSocket = ClientSocketWrapper.New<any>({
      url: testServer.url,
      onConnect: () => {
        facilitatorReady = true;
      }
    });
    const studentSocket = ClientSocketWrapper.New<any>({
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
    capacity = 6;
    facilitatorClientSocket.send("startRoom", [capacity, (roomId: string) => {
      room = roomId;
    }]);

    await waitForCondition(() => room !== badRoomId);
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
    studentClientSockets[0].send("joinRoom", [room, (response: TJoinRoomResponse) => {
      validateResponse(response);
      const info = toInfo(response);
      expect(info.layer).toBe(EParticipantRole.InputLayer);
      expect(info.indexWithinLayer).toBe(0);
      firstJoined = true;
    }]);

    await waitForCondition(() => firstJoined);

    // 1 facilitator + 1 student
    expect(getSizeOfRoom(socketServer, room)).toBe(2);
    const remainingPositions = capacity - 1;

    let tasks: Promise<void>[] = [];
    for (let i = 0; i < remainingPositions; i++) {
      let joined = false;
      const studentSocket = ClientSocketWrapper.New<any>({
        url: testServer.url,
        onConnect: () => {
          studentSocket.send("joinRoom", [room, (response: TJoinRoomResponse) => {
            validateResponse(response);
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
    const doomedSocket = ClientSocketWrapper.New<any>({
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
  });
})