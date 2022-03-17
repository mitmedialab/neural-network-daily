import nameOf, { _function } from "nameOfUtility";
import { TGraphConfig, TGraphMap, TLayerConfig } from "shared/graph/graphConfigs";
import C2CNode, { TConnectionInfo } from "../shared/graph/C2CNode";
import EParticipantRole from "./shared/enums/EParticipantRole";
import { TLayerInfo } from "./shared/graph/C2CNode";
import GraphFactory from "./shared/graph/GraphFactory"

describe(nameOf(GraphFactory), () => {
  const factory: GraphFactory = new GraphFactory();
  const six: TGraphConfig = factory.getConfig(6);
  const eight: TGraphConfig = factory.getConfig(8);

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
    const inputNode: C2CNode<any, any> = factory.buildNodeForGraph(six, { layer: EParticipantRole.InputLayer, indexWithinLayer: 2 });
    const hiddenLayerNode: C2CNode<any, any> = factory.buildNodeForGraph(six, { layer: EParticipantRole.HiddenLayer1, indexWithinLayer: 1 });
    const outputLayerNode: C2CNode<any, any> = factory.buildNodeForGraph(six, { layer: EParticipantRole.OutputLayer, indexWithinLayer: 0 });

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
    const map: TGraphMap<any> = factory.getEmptyGraphMap(six);
    expect(map.get(EParticipantRole.InputLayer)).not.toBe(undefined);
    expect(map.get(EParticipantRole.HiddenLayer1)).not.toBe(undefined);
    expect(map.get(EParticipantRole.HiddenLayer2)).toBe(undefined);
    expect(map.get(EParticipantRole.OutputLayer)).not.toBe(undefined);
    expect(factory.getNumberOfActiveNodes(map)).toBe(0);

    const map2: TGraphMap<any> = factory.getEmptyGraphMap(eight);
    expect(map2.get(EParticipantRole.InputLayer)).not.toBe(undefined);
    expect(map2.get(EParticipantRole.HiddenLayer1)).not.toBe(undefined);
    expect(map2.get(EParticipantRole.HiddenLayer2)).not.toBe(undefined);
    expect(map2.get(EParticipantRole.OutputLayer)).not.toBe(undefined);
    expect(factory.getNumberOfActiveNodes(map)).toBe(0);
  });

  test(nameOf(GraphFactory, _function, "tryAddToFirstEmptyNode"), () => {
    const map: TGraphMap<any> = factory.getEmptyGraphMap(six);
    const layerConfig = factory.getLayerConfigMap(six);

    const addAndCheck = (layer: EParticipantRole) => {
      const capacity: number = layerConfig.get(layer)?.nodeCount ?? 0;
      expect(capacity).toBeGreaterThan(0);
      for (let i = 0; i < capacity; i++) {
        const id: string = `${layer}--${i}`;
        const result = factory.tryAddToFirstEmptyNode(map, six, id);
        expect(map.get(layer)?.get(i)).toBe(id);
        expect(result.success).toBe(true);
        expect(result.info.layer).toBe(layer);
        expect(result.info.indexWithinLayer).toBe(i);
      }
    }

    let runningTotal = 0;
    for (const entry of layerConfig) {
      const [layer, config]: [EParticipantRole, TLayerConfig] = entry;
      runningTotal += config.nodeCount;
      addAndCheck(layer);
      expect(factory.getNumberOfActiveNodes(map)).toBe(runningTotal);
    }

    const result = factory.tryAddToFirstEmptyNode(map, six, 'invalid');
    expect(result.success).toBe(false);
  })

  test(nameOf(GraphFactory, _function, "removeNode"), () => {
    const map: TGraphMap<any> = factory.getEmptyGraphMap(six);
    const layerConfig = factory.getLayerConfigMap(six);

    type TTestState = { [key in EParticipantRole]?: boolean };
    const checkFull = (shouldBeFull: TTestState) => {
      for (const item of layerConfig) {
        const [layer, config]: [EParticipantRole, TLayerConfig] = item;
        if (shouldBeFull[layer]) {
          expect(map.get(layer)?.size).toBe(config.nodeCount);
        } else {
          expect(map.get(layer)?.size).not.toBe(config.nodeCount);
        }
      }
    }

    for (let i = 0; i < six.capacity; i++) {
      const id = `${i}`;
      const result = factory.tryAddToFirstEmptyNode(map, six, id);
      expect(map.get(result.info.layer)?.get(result.info.indexWithinLayer)).toBe(id);
      expect(result.success).toBe(true);
    }

    const state: TTestState = {
      [EParticipantRole.InputLayer]: true,
      [EParticipantRole.HiddenLayer1]: true,
      [EParticipantRole.OutputLayer]: true,
    }

    checkFull(state);

    const toRemove: TLayerInfo = { layer: EParticipantRole.HiddenLayer1, indexWithinLayer: 1 };
    factory.removeNode(map, toRemove);
    state[toRemove.layer] = false;
    checkFull(state);
    expect(map.get(toRemove.layer)?.has(toRemove.indexWithinLayer)).toBe(false);

    const id = `new`;
    const result = factory.tryAddToFirstEmptyNode(map, six, id);

    expect(result.info).toEqual(toRemove);
    expect(map.get(toRemove.layer)?.get(toRemove.indexWithinLayer)).toBe(id);
  });
})