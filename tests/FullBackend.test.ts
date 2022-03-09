import { createServer, Server as httpServer } from "http";
import { waitForCondition } from "shared/common/utils";
import ClientSocketWrapper from "shared/sockets/ClientSocketWrapper";
import { TestingServer } from "utils";
import { TGraphConfig } from "./shared/graph/graphConfigs";
import GraphFactory from "./shared/graph/GraphFactory"
import establishSocketServer, { getSizeOfRoom } from "./shared/sockets/socketManagement";

describe("Full Backend", () => {
  test("Room management", async () => {
    const testServer = new TestingServer();
    const socketServer = establishSocketServer(testServer.httpsServer);

    let facilitatorReady: boolean = false;
    let studentReady: boolean = false;
    const faciliatorSocket = ClientSocketWrapper.New<any>({
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

    await waitForCondition(() => studentReady && facilitatorReady);

    expect(socketServer.sockets.sockets.size).toBe(2);

    const badRoomId = "-1";
    let room: string = badRoomId;
    faciliatorSocket.send("startRoom", [6, (roomId: string) => {
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

    const factory: GraphFactory = new GraphFactory();
    const config: TGraphConfig = factory.getConfig(6);

    socketServer.close();
    testServer.close();
  })
})