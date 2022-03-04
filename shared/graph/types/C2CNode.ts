import EParticipantRole from "../../enums/EParticipantRole";
import IEquatable from "../../common/IEquatable";

/**
 * Information about a student acting as a node in the C2C network
 */
type TParticipantInfo = {
  name: string;
  room: string;
}

/**
 * Information about where a C2C node fits into the network
 */
type TLayerInfo = {
  layer: EParticipantRole;
  indexWithinLayer: number;
}

/**
 * A piece of information sent from a node in the C2C network.
 * NOTE: A downstream node is NOT guranteed to use all data in this packet, even if it is a connected node.
 * This is because hidden_layer_1 node's will only use 1 item of data (a contour) from each input node. 
 * This set up allows us to ensure the client can discriminate which data it should care about without needng to keep track of state on the server. 
 */
type TDataPacket<TData> = {
  info: TLayerInfo;
  data: TData[];
}

/**
 * 
 */
type TDataInfo = {
  indexWithinDataPacket: number;
}

/**
 * 
 */
type TConnectionInfo = TDataInfo & TLayerInfo;

/**
 * Somewhat-generic concept of a node in a network that receives input and 'sends' output.
 * Some of the methods are a little C2C specific...
 */
type TNode<TInput, TOutput> = {
  outputSize: number;
  inputSize: number;
  input: TInput[];
  output: TOutput[];
  connectedInputInfo: TLayerInfo[];
  trySetInput(packet: TDataPacket<TInput>);
  /** Get all output from this node */
  getOuput(): TDataPacket<TOutput>;
  /** Set a single entry in the node's ouput */
  setOutput(index: number, entry: TOutput);
  /**  */
  clear();
  ready(): boolean;
}

class C2CNode<TInput, TOutput>
  implements TNode<TInput, TOutput>, TLayerInfo, IEquatable<TLayerInfo>, TParticipantInfo {
  outputSize: number;
  inputSize: number;
  input: TInput[];
  output: TOutput[];
  connectedInputInfo: TConnectionInfo[];
  layer: EParticipantRole;
  indexWithinLayer: number;
  name: string;
  room: string;

  equals(other: TLayerInfo): boolean {
    return other.layer === this.layer && other.indexWithinLayer === this.indexWithinLayer
  };
  trySetInput(packet: TDataPacket<TInput>) {
    this.connectedInputInfo.forEach((info, index) => {
      if (this.equals(packet.info)) {
        this.input[index] = packet.data[info.indexWithinDataPacket];
        return;
      }
    })
  }
  getOuput(): TDataPacket<TOutput> {
    return { info: { layer: this.layer, indexWithinLayer: this.layer }, data: this.output }
  }
  setOutput(index: number, entry: TOutput) {
    this.output[index] = entry;
  }
  clear() {
    this.input.fill(undefined);
    this.output.fill(undefined);
  }
  ready(): boolean {
    return this.input.every(entry => entry !== undefined);
  }

  constructor(inputSize: number,
    outputSize: number,
    connectedInputs: TConnectionInfo[]) {
    this.input = new Array<TInput>(inputSize);
    this.output = new Array<TOutput>(outputSize);
    this.connectedInputInfo = connectedInputs;
  }
}