import { createServer } from "http";
import { Server } from "socket.io";
import Client from "socket.io-client";
import EParticipantRole from "../shared/enums/EParticipantRole";
import C2CNode, { TConnectionInfo, TLayerInfo, TParticipantInfo } from "../shared/graph/C2CNode";

describe("C2C Node Class", () => {
  test("constructor", () => {
    const participant: TParticipantInfo = { name: "dummy", room: "123" };
    const layer: TLayerInfo = { layer: EParticipantRole.HiddenLayer1, indexWithinLayer: 0 };
    const connections: TConnectionInfo[] = [
      {
        layer: EParticipantRole.InputLayer,
        indexWithinLayer: 0,
        indexWithinDataPacket: 0
      }];
    new C2CNode<number, number>(participant, layer, 3, 3, connections);
  });
  test(EParticipantRole[EParticipantRole.InputLayer], () => {
    const participant: TParticipantInfo = { name: "dummyInput", room: "123" };
    const layer: TLayerInfo = { layer: EParticipantRole.InputLayer, indexWithinLayer: 0 };
    const connections = undefined;
  });
});