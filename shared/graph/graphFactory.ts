import EParticipantRole from "../enums/EParticipantRole";
import C2CNode, { TConnectionInfo, TLayerInfo, TParticipantInfo, TDataInfo } from "./C2CNode";
import { Capacity6, Capacity7, Capacity8, Capacity9, Capacity10, Capacity11, Capacity12, TGraphConfig, TGraphMap, TLayerConfig } from "./graphConfigs"

class GraphFactory {
  layers: EParticipantRole[];
  configs: Record<number, TGraphConfig>;

  constructor() {
    this.layers = [
      EParticipantRole.InputLayer,
      EParticipantRole.HiddenLayer1,
      EParticipantRole.HiddenLayer2,
      EParticipantRole.OutputLayer];
    this.configs = {
      6: new Capacity6(),
      7: new Capacity7(),
      8: new Capacity8(),
      9: new Capacity9(),
      10: new Capacity10(),
      11: new Capacity11(),
      12: new Capacity12(),
    };
  }

  getConfig(graphCapacity: number): TGraphConfig {
    if (!(graphCapacity in this.configs)) throw new Error(`Unsupported capacity: ${graphCapacity}`);
    return this.configs[graphCapacity];
  }

  getLayerConfigMap(config: TGraphConfig): Map<EParticipantRole, TLayerConfig> {
    const map: Map<EParticipantRole, TLayerConfig> = new Map<EParticipantRole, TLayerConfig>();
    const validLayers = this.layers.filter(value => config[value] !== undefined);
    validLayers.forEach(value => map.set(value, config[value] as TLayerConfig));
    return map;
  }

  getEmptyGraphMap(config: TGraphConfig): TGraphMap {
    const map = new Map<EParticipantRole, Map<number, string>>();
    const validLayers = this.layers.filter(value => config[value] !== undefined);
    validLayers.forEach(value => map.set(value, new Map<number, string>()));
    return map;
  }

  getNumberOfActiveNodes(map: TGraphMap) {
    let count = 0;
    for (const entry of map) {
      const [_, layerMap]: [EParticipantRole, Map<number, string>] = entry;
      count += layerMap.size;
    }
    return count;
  }

  tryAddToFirstEmptyNode(map: TGraphMap, config: TGraphConfig, id: string): { success: boolean; info: TLayerInfo } {
    for (const entry of map) {
      const [layerType, layerMap]: [EParticipantRole, Map<number, string>] = entry;
      const layerCapacity = config[layerType]?.nodeCount ?? 0;
      for (let nodeIndex = 0; nodeIndex < layerCapacity; nodeIndex++) {
        if (!layerMap.has(nodeIndex)) {
          layerMap.set(nodeIndex, id);
          return { success: true, info: { layer: layerType, indexWithinLayer: nodeIndex } };
        }
      }
    }
    return { success: false, info: { layer: -1, indexWithinLayer: -1 } };
  }

  removeNode(map: TGraphMap, node: TLayerInfo): void {
    map.get(node.layer)?.delete(node.indexWithinLayer);
  }

  getNodeInfoAtPosition(graphConfig: TGraphConfig, globalIndex: number): TLayerInfo {
    let runningCount = 0;
    for (let layerIndex = 0; layerIndex <= this.layers.length - 1; layerIndex++) {
      const layer: EParticipantRole = this.layers[layerIndex];
      const layerConfig: TLayerConfig | undefined = graphConfig[layer];
      if (layerConfig === undefined) continue;

      const { nodeCount }: TLayerConfig = layerConfig;
      const lowerBound = runningCount;
      const upperBound = runningCount += nodeCount;
      if (globalIndex >= upperBound) continue;
      return { layer: layerIndex, indexWithinLayer: globalIndex - lowerBound };
    }

    throw new Error("Could not identify node position");
  }

  getPreviousLayer(graphConfig: TGraphConfig, info: TLayerInfo): EParticipantRole {
    const queryLayerIndex = this.layers.indexOf(info.layer);
    if (queryLayerIndex <= 0) throw new Error(`No previous layer for layer for ${info.layer}`);
    for (let layerIndex = queryLayerIndex - 1; layerIndex >= 0; layerIndex--) {
      const layer: EParticipantRole = this.layers[layerIndex];
      if (graphConfig[layer] !== undefined) {
        return layer;
      }
    }
    throw new Error("Could not identify layer");
  }

  getNextLayer(graphConfig: TGraphConfig, info: TLayerInfo): EParticipantRole {
    const queryLayerIndex = this.layers.indexOf(info.layer);
    const lastLayerIndex = this.layers.length - 1;
    if (queryLayerIndex >= lastLayerIndex) throw new Error(`No next layer for layer for ${info.layer}`);
    for (let layerIndex = queryLayerIndex + 1; layerIndex <= lastLayerIndex; layerIndex++) {
      const layer: EParticipantRole = this.layers[layerIndex];
      if (graphConfig[layer] !== undefined) {
        return layer;
      }
    }
    throw new Error("Could not identify layer");
  }

  buildNodeForGraph
    <TInput, TOutput>(
      graphConfig: TGraphConfig,
      nodeInfo: TLayerInfo,
      participantInfo: TParticipantInfo = { name: "defaultName", room: "defaultRoom" }):
    C2CNode<TInput, TOutput> {
    const layerInfo = graphConfig[nodeInfo.layer];
    if (layerInfo === undefined) throw new Error(`No information on node's layer: ${nodeInfo.layer}`);
    if (nodeInfo.indexWithinLayer >= layerInfo.nodeCount) throw new Error(`Invalid node (layer: ${nodeInfo.layer}, index: ${nodeInfo.indexWithinLayer}) for graph of capacity ${graphConfig.capacity}`)

    let inputSize: number;
    let connections: TConnectionInfo[] | undefined;
    if (nodeInfo.layer !== EParticipantRole.InputLayer) {
      const previousLayer = this.getPreviousLayer(graphConfig, nodeInfo);
      const previousLayerInfo = graphConfig[previousLayer];
      if (previousLayerInfo === undefined) throw new Error(`No information on previous layer ${previousLayer}`);
      if (!(nodeInfo.indexWithinLayer < previousLayerInfo.outputsPerNode)) {
        throw new Error(`Not enough outputs in layer ${previousLayer} to connect with node ${nodeInfo.indexWithinLayer} within layer ${nodeInfo.layer}`)
      };
      inputSize = previousLayerInfo.nodeCount;
      connections = [...Array(inputSize).keys()].map<TConnectionInfo>(index => {
        const layerInfo: TLayerInfo = { layer: previousLayer, indexWithinLayer: index };
        const dataInfo: TDataInfo = { indexWithinDataPacket: nodeInfo.indexWithinLayer };
        return { ...layerInfo, ...dataInfo };
      });
    } else {
      inputSize = 0;
      connections = undefined;
    }

    // Assumption is that each node is fully connected to the previous layer
    const outputSize = layerInfo.outputsPerNode;

    return new C2CNode<TInput, TOutput>(participantInfo, nodeInfo, inputSize, outputSize, connections);
  }

  addToGraph<TInput, TOutput>(
    graph: Map<EParticipantRole, C2CNode<TInput, TOutput>[]>,
    graphConfig: TGraphConfig,
    layer: EParticipantRole): void {
    if (graphConfig[layer] === undefined) return;
    const { nodeCount } = graphConfig[layer] as TLayerConfig;

    for (let i = 0; i < nodeCount; i++) {
      const node = this.buildNodeForGraph<TInput, TOutput>(graphConfig, { layer, indexWithinLayer: i });
      if (graph.has(layer)) {
        graph.get(layer)?.push(node);
      } else {
        graph.set(layer, [node]);
      }
    }
  }

  buildGraph
    <TInputLayerOutput, THiddenLayer1Output, THiddenLayer2Output, TOutputLayerOuput>
    (graphConfig: TGraphConfig)
    : Map<EParticipantRole, C2CNode<TInputLayerOutput | THiddenLayer1Output | THiddenLayer2Output, TInputLayerOutput | THiddenLayer1Output | THiddenLayer2Output | TOutputLayerOuput>[]> {
    type TPotentialInputs = TInputLayerOutput | THiddenLayer1Output | THiddenLayer2Output;
    type TPotentialOutputs = TInputLayerOutput | THiddenLayer1Output | THiddenLayer2Output | TOutputLayerOuput;
    type TNodeType = C2CNode<TPotentialInputs, TPotentialOutputs>;
    const map: Map<EParticipantRole, TNodeType[]> = new Map<EParticipantRole, TNodeType[]>();
    this.layers.
      filter(layer => graphConfig[layer]).
      forEach(layer => this.addToGraph(map, graphConfig, layer));
    return map;
  }
}

export default GraphFactory;