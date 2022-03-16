import { n as noop, d as safe_not_equal } from "./index-49e878d2.js";
import { io } from "socket.io-client";
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}
const appNamePrefix = "Contours2Classification_";
function createPersistentStore(key, startValue = null) {
  const prefixedKey = appNamePrefix + key;
  const browser = typeof localStorage != "undefined";
  const getStoredData = () => {
    if (browser) {
      const json = localStorage.getItem(prefixedKey);
      return json ? JSON.parse(json) : startValue;
    }
    return startValue;
  };
  const setStoreData = (value) => {
    if (browser) {
      localStorage.setItem(prefixedKey, JSON.stringify(value));
    }
  };
  const { subscribe, set, update } = writable(getStoredData());
  subscribe((current) => setStoreData(current));
  return { subscribe, update, set };
}
var EParticipantRole;
(function(EParticipantRole2) {
  EParticipantRole2[EParticipantRole2["InputLayer"] = 0] = "InputLayer";
  EParticipantRole2[EParticipantRole2["HiddenLayer1"] = 1] = "HiddenLayer1";
  EParticipantRole2[EParticipantRole2["HiddenLayer2"] = 2] = "HiddenLayer2";
  EParticipantRole2[EParticipantRole2["OutputLayer"] = 3] = "OutputLayer";
  EParticipantRole2[EParticipantRole2["Facilitator"] = 4] = "Facilitator";
})(EParticipantRole || (EParticipantRole = {}));
var EParticipantRole$1 = EParticipantRole;
class C2CNode {
  static nodesEqual(a, b) {
    return a.layer === b.layer && a.indexWithinLayer === b.indexWithinLayer;
  }
  trySetInput(packet) {
    if (!this.connectedInputInfo)
      return false;
    for (const [index, info] of this.connectedInputInfo.entries()) {
      if (C2CNode.nodesEqual(info, packet.info)) {
        this.input[index] = packet.data[info.indexWithinDataPacket];
        return true;
      }
    }
    return false;
  }
  getOuput() {
    if (this.output.includes(void 0)) {
      throw new Error("Output contains undefined!");
    }
    return { info: { layer: this.layer, indexWithinLayer: this.layer }, data: this.output };
  }
  setOutput(index, entry) {
    this.output[index] = entry;
  }
  clear() {
    this.input?.fill(void 0);
    this.output?.fill(void 0);
  }
  ready() {
    return this.input.every((entry) => entry !== void 0);
  }
  constructor(participantInfo, layerInfo, inputSize, outputSize, connectedInputs) {
    this.room = participantInfo.room;
    this.name = participantInfo.name;
    this.layer = layerInfo.layer;
    this.indexWithinLayer = layerInfo.indexWithinLayer;
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    this.input = new Array(inputSize);
    this.output = new Array(outputSize);
    this.connectedInputInfo = connectedInputs;
  }
}
var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w;
class BaseConfig {
  constructor() {
    this[_a] = {
      nodeCount: 1,
      outputsPerNode: 1,
      contourOuputWidth: 1
    };
    this[_b] = void 0;
  }
}
_a = EParticipantRole$1.OutputLayer, _b = EParticipantRole$1.Facilitator;
class Capacity6 extends BaseConfig {
  constructor() {
    super(...arguments);
    this.capacity = 6;
    this.depth = 3;
    this[_c] = {
      nodeCount: 3,
      outputsPerNode: 2,
      contourOuputWidth: 2
    };
    this[_d] = {
      nodeCount: 2,
      outputsPerNode: 1,
      contourOuputWidth: 2
    };
    this[_e] = void 0;
  }
}
_c = EParticipantRole$1.InputLayer, _d = EParticipantRole$1.HiddenLayer1, _e = EParticipantRole$1.HiddenLayer2;
class Capacity7 extends BaseConfig {
  constructor() {
    super(...arguments);
    this.capacity = 7;
    this.depth = 3;
    this[_f] = {
      nodeCount: 4,
      outputsPerNode: 2,
      contourOuputWidth: 2
    };
    this[_g] = {
      nodeCount: 2,
      outputsPerNode: 1,
      contourOuputWidth: 2
    };
    this[_h] = void 0;
  }
}
_f = EParticipantRole$1.InputLayer, _g = EParticipantRole$1.HiddenLayer1, _h = EParticipantRole$1.HiddenLayer2;
class Capacity8 extends BaseConfig {
  constructor() {
    super(...arguments);
    this.capacity = 8;
    this.depth = 4;
    this[_i] = {
      nodeCount: 4,
      outputsPerNode: 2,
      contourOuputWidth: 2
    };
    this[_j] = {
      nodeCount: 2,
      outputsPerNode: 1,
      contourOuputWidth: 3
    };
    this[_k] = {
      nodeCount: 1,
      outputsPerNode: 1,
      contourOuputWidth: 4
    };
  }
}
_i = EParticipantRole$1.InputLayer, _j = EParticipantRole$1.HiddenLayer1, _k = EParticipantRole$1.HiddenLayer2;
class Capacity9 extends BaseConfig {
  constructor() {
    super(...arguments);
    this.capacity = 9;
    this.depth = 4;
    this[_l] = {
      nodeCount: 4,
      outputsPerNode: 3,
      contourOuputWidth: 3
    };
    this[_m] = {
      nodeCount: 3,
      outputsPerNode: 1,
      contourOuputWidth: 2
    };
    this[_n] = {
      nodeCount: 1,
      outputsPerNode: 1,
      contourOuputWidth: 4
    };
  }
}
_l = EParticipantRole$1.InputLayer, _m = EParticipantRole$1.HiddenLayer1, _n = EParticipantRole$1.HiddenLayer2;
class Capacity10 extends BaseConfig {
  constructor() {
    super(...arguments);
    this.capacity = 10;
    this.depth = 4;
    this[_o] = {
      nodeCount: 4,
      outputsPerNode: 4,
      contourOuputWidth: 4
    };
    this[_p] = {
      nodeCount: 4,
      outputsPerNode: 1,
      contourOuputWidth: 2
    };
    this[_q] = {
      nodeCount: 1,
      outputsPerNode: 1,
      contourOuputWidth: 4
    };
  }
}
_o = EParticipantRole$1.InputLayer, _p = EParticipantRole$1.HiddenLayer1, _q = EParticipantRole$1.HiddenLayer2;
class Capacity11 extends BaseConfig {
  constructor() {
    super(...arguments);
    this.capacity = 11;
    this.depth = 4;
    this[_r] = {
      nodeCount: 5,
      outputsPerNode: 4,
      contourOuputWidth: 4
    };
    this[_s] = {
      nodeCount: 4,
      outputsPerNode: 1,
      contourOuputWidth: 2
    };
    this[_t] = {
      nodeCount: 1,
      outputsPerNode: 1,
      contourOuputWidth: 4
    };
  }
}
_r = EParticipantRole$1.InputLayer, _s = EParticipantRole$1.HiddenLayer1, _t = EParticipantRole$1.HiddenLayer2;
class Capacity12 extends BaseConfig {
  constructor() {
    super(...arguments);
    this.capacity = 12;
    this.depth = 4;
    this[_u] = {
      nodeCount: 6,
      outputsPerNode: 4,
      contourOuputWidth: 4
    };
    this[_v] = {
      nodeCount: 4,
      outputsPerNode: 1,
      contourOuputWidth: 2
    };
    this[_w] = {
      nodeCount: 1,
      outputsPerNode: 1,
      contourOuputWidth: 4
    };
  }
}
_u = EParticipantRole$1.InputLayer, _v = EParticipantRole$1.HiddenLayer1, _w = EParticipantRole$1.HiddenLayer2;
class GraphFactory {
  constructor() {
    this.layers = [
      EParticipantRole$1.InputLayer,
      EParticipantRole$1.HiddenLayer1,
      EParticipantRole$1.HiddenLayer2,
      EParticipantRole$1.OutputLayer
    ];
    this.configs = {
      6: new Capacity6(),
      7: new Capacity7(),
      8: new Capacity8(),
      9: new Capacity9(),
      10: new Capacity10(),
      11: new Capacity11(),
      12: new Capacity12()
    };
  }
  getConfig(graphCapacity) {
    if (!(graphCapacity in this.configs))
      throw new Error(`Unsupported capacity: ${graphCapacity}`);
    return this.configs[graphCapacity];
  }
  getLayerConfigMap(config) {
    const map = new Map();
    const validLayers = this.layers.filter((value) => config[value] !== void 0);
    validLayers.forEach((value) => map.set(value, config[value]));
    return map;
  }
  getEmptyGraphMap(config) {
    const map = new Map();
    const validLayers = this.layers.filter((value) => config[value] !== void 0);
    validLayers.forEach((value) => map.set(value, new Map()));
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
      if (layerConfig === void 0)
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
      if (graphConfig[layer] !== void 0) {
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
      if (graphConfig[layer] !== void 0) {
        return layer;
      }
    }
    throw new Error("Could not identify layer");
  }
  buildNodeForGraph(graphConfig, nodeInfo, participantInfo = { name: "defaultName", room: "defaultRoom" }) {
    const layerInfo = graphConfig[nodeInfo.layer];
    if (layerInfo === void 0)
      throw new Error(`No information on node's layer: ${nodeInfo.layer}`);
    if (nodeInfo.indexWithinLayer >= layerInfo.nodeCount)
      throw new Error(`Invalid node (layer: ${nodeInfo.layer}, index: ${nodeInfo.indexWithinLayer}) for graph of capacity ${graphConfig.capacity}`);
    let inputSize;
    let connections;
    if (nodeInfo.layer !== EParticipantRole$1.InputLayer) {
      const previousLayer = this.getPreviousLayer(graphConfig, nodeInfo);
      const previousLayerInfo = graphConfig[previousLayer];
      if (previousLayerInfo === void 0)
        throw new Error(`No information on previous layer ${previousLayer}`);
      if (!(nodeInfo.indexWithinLayer < previousLayerInfo.outputsPerNode)) {
        throw new Error(`Not enough outputs in layer ${previousLayer} to connect with node ${nodeInfo.indexWithinLayer} within layer ${nodeInfo.layer}`);
      }
      inputSize = previousLayerInfo.nodeCount;
      connections = [...Array(inputSize).keys()].map((index) => {
        const layerInfo2 = { layer: previousLayer, indexWithinLayer: index };
        const dataInfo = { indexWithinDataPacket: nodeInfo.indexWithinLayer };
        return { ...layerInfo2, ...dataInfo };
      });
    } else {
      inputSize = 0;
      connections = void 0;
    }
    const outputSize = layerInfo.outputsPerNode;
    return new C2CNode(participantInfo, nodeInfo, inputSize, outputSize, connections);
  }
  addToGraph(graph, graphConfig, layer) {
    if (graphConfig[layer] === void 0)
      return;
    const { nodeCount } = graphConfig[layer];
    for (let i = 0; i < nodeCount; i++) {
      const node = this.buildNodeForGraph(graphConfig, { layer, indexWithinLayer: i });
      if (graph.has(layer)) {
        graph.get(layer)?.push(node);
      } else {
        graph.set(layer, [node]);
      }
    }
  }
  buildGraph(graphConfig) {
    const map = new Map();
    this.layers.filter((layer) => graphConfig[layer]).forEach((layer) => this.addToGraph(map, graphConfig, layer));
    return map;
  }
}
const graphFactory = readable(new GraphFactory());
const socket = readable(io());
createPersistentStore("room", void 0);
createPersistentStore("role", void 0);
createPersistentStore("inputs", void 0);
export { graphFactory as g, socket as s };
