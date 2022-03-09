import { createServer, Server as httpServer } from "http";
import { AddressInfo } from 'net'
import { Server, Socket } from "socket.io";
import nameOf, { _function } from "./nameOfUtility";
import ClientSocketWrapper from "./shared/sockets/ClientSocketWrapper";
import { waitForCondition } from "./shared/common/utils";
import { TDataPacket } from "../shared/graph/C2CNode";
import { GenericServerSocket } from "shared/sockets/socketEvents";
import EParticipantRole from "../shared/enums/EParticipantRole";

describe(nameOf(ClientSocketWrapper), () => {
  let io: Server;
  let httpServer: httpServer;
  let serverSocket: GenericServerSocket<number>;
  let clientWrapper: ClientSocketWrapper<number>;

  beforeAll((done) => {
    httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const address: AddressInfo = httpServer.address() as AddressInfo;
      const port = address.port;
      io.on("connection", (socket) => {
        serverSocket = socket;
      });

      clientWrapper = ClientSocketWrapper.New<number>({ endpoint: `http://localhost:${port}`, onConnect: done });
    });
  });

  afterAll(() => {
    io.close();
    httpServer.close();
    clientWrapper.close();
  });

  test(nameOf(ClientSocketWrapper, _function, "on"), async () => {
    const tests: Promise<void>[] = [];

    let start = false;
    clientWrapper.on("start", () => { start = true; });
    serverSocket.emit("start");
    tests.push(waitForCondition(() => start));

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
    const roleToSet: EParticipantRole = EParticipantRole.HiddenLayer2;
    serverSocket.on("joinRoom", (roomID: string, callback: (role: EParticipantRole) => void) => {
      expect(roomID).toBe(roomToSet);
      callback(roleToSet);
    });
    clientWrapper.send("joinRoom", [roomToSet, (role: EParticipantRole) => {
      expect(role).toBe(roleToSet);
      join = true;
    }]);
    tests.push(waitForCondition(() => join));

    let propogate = false;
    const value: number = 10;
    serverSocket.on("propogate", (packet: TDataPacket<number>) => {
      expect(packet.data[0]).toBe(value);
      propogate = true;
    });
    clientWrapper.send("propogate", [{ info: { layer: roleToSet, indexWithinLayer: 0 }, data: [value] }]);
    tests.push(waitForCondition(() => propogate));

    await Promise.all(tests);
  })
});