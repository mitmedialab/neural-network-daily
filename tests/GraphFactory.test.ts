import nameOf, { _function } from "nameOfUtility";
import { TGraphConfig, TLayerConfig } from "shared/graph/graphConfigs";
import EParticipantRole from "./shared/enums/EParticipantRole";
import { TLayerInfo } from "./shared/graph/C2CNode";
import GraphFactory from "./shared/graph/GraphFactory"

describe("Graph Factory Tests", () => {
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
    console.log(factory.buildNodeForGraph(six, 5));
  });

  test(nameOf(GraphFactory, _function, "getLayerConfigMap"), () => {
    const map: Map<EParticipantRole, TLayerConfig> = factory.getLayerConfigMap(six);
  });
})