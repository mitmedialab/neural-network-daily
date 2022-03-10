import { createServer, Server as httpServer } from "http";
import { AddressInfo } from 'net'
import { Server, Socket } from "socket.io";
import nameOf, { _function } from "./nameOfUtility";
import ClientSocketWrapper from "./shared/sockets/ClientSocketWrapper";
import { waitForCondition } from "./shared/common/utils";
import { TDataPacket, TLayerInfo } from "../shared/graph/C2CNode";
import { GenericServerSocket, TJoinRoomResponse, toInfo } from "shared/sockets/socketEvents";
import EParticipantRole from "../shared/enums/EParticipantRole";
import { TestingServer } from "utils";

describe(nameOf(ClientSocketWrapper), () => {
  let testServer: TestingServer;
  let io: Server;
  let serverSocket: GenericServerSocket<number>;
  let clientWrapper: ClientSocketWrapper<number>;

  beforeAll((done) => {
    testServer = new TestingServer();
    io = new Server(testServer.httpsServer);
    io.on("connection", (socket) => { serverSocket = socket; });
    clientWrapper = ClientSocketWrapper.New<number>({ url: testServer.url, onConnect: done });
  });

  afterAll(() => {
    io.close();
    testServer.close();
    clientWrapper.close();
  });

  test(nameOf(ClientSocketWrapper, _function, "on"), async () => {
    const tests: Promise<void>[] = [];

    let start1 = false;
    let start2 = false;
    clientWrapper.on("start", () => { start1 = true; });
    clientWrapper.on("start", () => { start2 = true; });
    serverSocket.emit("start");
    tests.push(waitForCondition(() => start1 && start2));

    let update = false;
    const value: number = 10;
    clientWrapper.on<"update">("update", (packet: TDataPacket<number>) => {
      expect(packet.data[0]).toBe(value);
      update = true;
    });
    serverSocket.emit("update", { data: [value], info: { layer: EParticipantRole.Facilitator, indexWithinLayer: 0 } });
    tests.push(waitForCondition(() => update));

    await Promise.all(tests);
  });

  test(nameOf(ClientSocketWrapper, _function, "send"), async () => {
    const tests: Promise<void>[] = [];
    const capacityToSet: number = 10;
    const roomToSet: string = "123";

    let start = false;
    serverSocket.on("startRoom", (capacity: number, callback: (roomId: string) => void) => {
      expect(capacity).toBe(capacityToSet);
      callback(roomToSet);
    })
    clientWrapper.send("startRoom", [capacityToSet, (roomID: string) => {
      expect(roomID).toBe(roomToSet);
      start = true;
    }]);
    tests.push(waitForCondition(() => start));

    let join = false;
    const responseToSet: TJoinRoomResponse = {
      success: true,
      layer: EParticipantRole.HiddenLayer2,
      indexWithinLayer: 1,
    }
    serverSocket.on("joinRoom", (roomID: string, callback: (response: TJoinRoomResponse) => void) => {
      expect(roomID).toBe(roomToSet);
      callback(responseToSet);
    });
    clientWrapper.send("joinRoom", [roomToSet, (response: TJoinRoomResponse) => {
      expect(response).toEqual(responseToSet);
      join = true;
    }]);
    tests.push(waitForCondition(() => join));

    let propogate = false;
    const value: number = 10;
    serverSocket.on("propogate", (packet: TDataPacket<number>) => {
      expect(packet.data[0]).toBe(value);
      propogate = true;
    });
    clientWrapper.send("propogate", [{ info: toInfo(responseToSet), data: [value] }]);
    tests.push(waitForCondition(() => propogate));

    await Promise.all(tests);
  })
});