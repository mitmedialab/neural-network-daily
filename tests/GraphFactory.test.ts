import nameOf, { _function } from "nameOfUtility";
import { TGraphConfig, TGraphMap, TLayerConfig } from "shared/graph/graphConfigs";
import C2CNode, { TConnectionInfo } from "../shared/graph/C2CNode";
import EParticipantRole from "./shared/enums/EParticipantRole";
import { TLayerInfo } from "./shared/graph/C2CNode";
import GraphFactory from "./shared/graph/GraphFactory"

describe(nameOf(GraphFactory), () => {
  const factory: GraphFactory = new GraphFactory();
  const six: TGraphConfig = factory.getConfig(6);

  test(nameOf(GraphFactory, _function, "getNodeInfoAtPosition"), () => {
    expect(factory.getNodeInfoAtPosition(six, 0)).
      toEqual<TLayerInfo>({ layer: EParticipantRole.InputLayer, indexWithinLayer: 0 });
    expect(factory.getNodeInfoAtPosition(six, 1)).
      toEqual<TLayerInfo>({ layer: EParticipantRole.InputLayer, indexWithinLayer: 1 });
    expect(factory.getNodeInfoAtPosition(six, 2)).
      toEqual<TLayerInfo>({ layer: EParticipantRole.InputLayer, indexWithinLayer: 2 });
    expect(factory.getNodeInfoAtPosition(six, 3)).
      toEqual<TLayerInfo>({ layer: EParticipantRole.HiddenLayer1, indexWithinLayer: 0 });
    expect(factory.getNodeInfoAtPosition(six, 4)).
      toEqual<TLayerInfo>({ layer: EParticipantRole.HiddenLayer1, indexWithinLayer: 1 });
    expect(factory.getNodeInfoAtPosition(six, 5)).
      toEqual<TLayerInfo>({ layer: EParticipantRole.OutputLayer, indexWithinLayer: 0 });
  });

  test(nameOf(GraphFactory, _function, "getPreviousLayer"), () => {
    const input: TLayerInfo = { layer: EParticipantRole.InputLayer, indexWithinLayer: 0 };
    const hidden: TLayerInfo = { layer: EParticipantRole.HiddenLayer1, indexWithinLayer: 0 };
    const output: TLayerInfo = { layer: EParticipantRole.OutputLayer, indexWithinLayer: 0 };
    expect(() => factory.getPreviousLayer(six, input)).toThrowError();
    expect(factory.getPreviousLayer(six, hidden)).toBe(EParticipantRole.InputLayer);
    expect(factory.getPreviousLayer(six, output)).toBe(EParticipantRole.HiddenLayer1);
  });

  test(nameOf(GraphFactory, _function, "buildNodeForGraph"), () => {
    const inputLayerIndex = 2;
    const hiddenLayerIndex = 4;
    const outputLayerIndex = 5;

    const inputNode: C2CNode<any, any> = factory.buildNodeForGraph(six, inputLayerIndex);
    const hiddenLayerNode: C2CNode<any, any> = factory.buildNodeForGraph(six, hiddenLayerIndex);
    const outputLayerNode: C2CNode<any, any> = factory.buildNodeForGraph(six, outputLayerIndex);

    expect(inputNode.connectedInputInfo).toBe(undefined);
    expect(hiddenLayerNode.connectedInputInfo).toEqual<TConnectionInfo[]>([
      { indexWithinDataPacket: 1, layer: EParticipantRole.InputLayer, indexWithinLayer: 0 },
      { indexWithinDataPacket: 1, layer: EParticipantRole.InputLayer, indexWithinLayer: 1 },
      { indexWithinDataPacket: 1, layer: EParticipantRole.InputLayer, indexWithinLayer: 2 }]);
    expect(outputLayerNode.connectedInputInfo).toEqual<TConnectionInfo[]>([
      { indexWithinDataPacket: 0, layer: EParticipantRole.HiddenLayer1, indexWithinLayer: 0 },
      { indexWithinDataPacket: 0, layer: EParticipantRole.HiddenLayer1, indexWithinLayer: 1 },
    ])
  });

  test(nameOf(GraphFactory, _function, "getLayerConfigMap"), () => {
    const map: Map<EParticipantRole, TLayerConfig> = factory.getLayerConfigMap(six);
  });

  test(nameOf(GraphFactory, _function, "getEmptyGraphMap"), () => {
    const map: TGraphMap = factory.getEmptyGraphMap(six);
    expect(map.get(EParticipantRole.InputLayer)).not.toBe(undefined);
    expect(map.get(EParticipantRole.HiddenLayer1)).not.toBe(undefined);
    expect(map.get(EParticipantRole.HiddenLayer2)).toBe(undefined);
    expect(map.get(EParticipantRole.OutputLayer)).not.toBe(undefined);
  });

  test(nameOf(GraphFactory, _function, "tryAddToFirstEmptyNode"), () => {

  });
})