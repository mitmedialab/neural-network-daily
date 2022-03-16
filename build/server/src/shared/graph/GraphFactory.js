import EParticipantRole from "../enums/EParticipantRole";
import C2CNode from "./C2CNode";
import { Capacity6, Capacity7, Capacity8, Capacity9, Capacity10, Capacity11, Capacity12 } from "./graphConfigs";
class GraphFactory {
    constructor() {
        this.layers = [
            EParticipantRole.InputLayer,
            EParticipantRole.HiddenLayer1,
            EParticipantRole.HiddenLayer2,
            EParticipantRole.OutputLayer
        ];
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
    getConfig(graphCapacity) {
        if (!(graphCapacity in this.configs))
            throw new Error(`Unsupported capacity: ${graphCapacity}`);
        return this.configs[graphCapacity];
    }
    getLayerConfigMap(config) {
        const map = new Map();
        const validLayers = this.layers.filter(value => config[value] !== undefined);
        validLayers.forEach(value => map.set(value, config[value]));
        return map;
    }
    getEmptyGraphMap(config) {
        const map = new Map();
        const validLayers = this.layers.filter(value => config[value] !== undefined);
        validLayers.forEach(value => map.set(value, new Map()));
        return map;
    }
    getNumberOfActiveNodes(map) {
        let count = 0;
        for (const entry of map) {
            const [_, layerMap] = entry;
            count += layerMap.size;
        }
        return count;
    }
    tryAddToFirstEmptyNode(map, config, id) {
        for (const entry of map) {
            const [layerType, layerMap] = entry;
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
    removeNode(map, node) {
        map.get(node.layer)?.delete(node.indexWithinLayer);
    }
    getNodeInfoAtPosition(graphConfig, globalIndex) {
        let runningCount = 0;
        for (let layerIndex = 0; layerIndex <= this.layers.length - 1; layerIndex++) {
            const layer = this.layers[layerIndex];
            const layerConfig = graphConfig[layer];
            if (layerConfig === undefined)
                continue;
            const { nodeCount } = layerConfig;
            const lowerBound = runningCount;
            const upperBound = runningCount += nodeCount;
            if (globalIndex >= upperBound)
                continue;
            return { layer: layerIndex, indexWithinLayer: globalIndex - lowerBound };
        }
        throw new Error("Could not identify node position");
    }
    getPreviousLayer(graphConfig, info) {
        const queryLayerIndex = this.layers.indexOf(info.layer);
        if (queryLayerIndex <= 0)
            throw new Error(`No previous layer for layer for ${info.layer}`);
        for (let layerIndex = queryLayerIndex - 1; layerIndex >= 0; layerIndex--) {
            const layer = this.layers[layerIndex];
            if (graphConfig[layer] !== undefined) {
                return layer;
            }
        }
        throw new Error("Could not identify layer");
    }
    getNextLayer(graphConfig, info) {
        const queryLayerIndex = this.layers.indexOf(info.layer);
        const lastLayerIndex = this.layers.length - 1;
        if (queryLayerIndex >= lastLayerIndex)
            throw new Error(`No next layer for layer for ${info.layer}`);
        for (let layerIndex = queryLayerIndex + 1; layerIndex <= lastLayerIndex; layerIndex++) {
            const layer = this.layers[layerIndex];
            if (graphConfig[layer] !== undefined) {
                return layer;
            }
        }
        throw new Error("Could not identify layer");
    }
    buildNodeForGraph(graphConfig, nodeInfo, participantInfo = { name: "defaultName", room: "defaultRoom" }) {
        const layerInfo = graphConfig[nodeInfo.layer];
        if (layerInfo === undefined)
            throw new Error(`No information on node's layer: ${nodeInfo.layer}`);
        if (nodeInfo.indexWithinLayer >= layerInfo.nodeCount)
            throw new Error(`Invalid node (layer: ${nodeInfo.layer}, index: ${nodeInfo.indexWithinLayer}) for graph of capacity ${graphConfig.capacity}`);
        let inputSize;
        let connections;
        if (nodeInfo.layer !== EParticipantRole.InputLayer) {
            const previousLayer = this.getPreviousLayer(graphConfig, nodeInfo);
            const previousLayerInfo = graphConfig[previousLayer];
            if (previousLayerInfo === undefined)
                throw new Error(`No information on previous layer ${previousLayer}`);
            if (!(nodeInfo.indexWithinLayer < previousLayerInfo.outputsPerNode)) {
                throw new Error(`Not enough outputs in layer ${previousLayer} to connect with node ${nodeInfo.indexWithinLayer} within layer ${nodeInfo.layer}`);
            }
            ;
            inputSize = previousLayerInfo.nodeCount;
            connections = [...Array(inputSize).keys()].map(index => {
                const layerInfo = { layer: previousLayer, indexWithinLayer: index };
                const dataInfo = { indexWithinDataPacket: nodeInfo.indexWithinLayer };
                return { ...layerInfo, ...dataInfo };
            });
        }
        else {
            inputSize = 0;
            connections = undefined;
        }
        // Assumption is that each node is fully connected to the previous layer
        const outputSize = layerInfo.outputsPerNode;
        return new C2CNode(participantInfo, nodeInfo, inputSize, outputSize, connections);
    }
    addToGraph(graph, graphConfig, layer) {
        if (graphConfig[layer] === undefined)
            return;
        const { nodeCount } = graphConfig[layer];
        for (let i = 0; i < nodeCount; i++) {
            const node = this.buildNodeForGraph(graphConfig, { layer, indexWithinLayer: i });
            if (graph.has(layer)) {
                graph.get(layer)?.push(node);
            }
            else {
                graph.set(layer, [node]);
            }
        }
    }
    buildGraph(graphConfig) {
        const map = new Map();
        this.layers.
            filter(layer => graphConfig[layer]).
            forEach(layer => this.addToGraph(map, graphConfig, layer));
        return map;
    }
}
export default GraphFactory;
//# sourceMappingURL=GraphFactory.js.map