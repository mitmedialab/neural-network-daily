import EParticipantRole from "../enums/EParticipantRole"
import IEquatable from "../common/IEquatable"

/**
 * Information about a student acting as a node in the C2C network
 */
export type TParticipantInfo = {
  name: string;
  room: string;
}

/**
 * Information about where a C2C node fits into the network
 */
export type TLayerInfo = {
  layer: EParticipantRole;
  indexWithinLayer: number;
}

/**
 * A piece of information sent from a node in the C2C network.
 * NOTE: A downstream node is NOT guranteed to use all data in this packet, even if it is a connected node.
 * This is because hidden_layer_1 node's will only use 1 item of data (a contour) from each input node. 
 * This set up allows us to ensure the client can discriminate which data it should care about without needng to keep track of state on the server. 
 */
export type TDataPacket<TData> = {
  info: TLayerInfo;
  data: TData[];
}

/**
 * 
 */
export type TDataInfo = {
  indexWithinDataPacket: number;
}

/**
 * 
 */
export type TConnectionInfo = TDataInfo & TLayerInfo;

/**
 * Somewhat-generic concept of a node in a network that receives input and 'sends' output.
 * Some of the methods are a little C2C specific...
 */
type TNode<TInput, TOutput> = {
  outputSize: number;
  inputSize: number;
  input: (TInput | undefined)[];
  output: (TOutput | undefined)[];
  connectedInputInfo: (TConnectionInfo[] | undefined);
  trySetInput(packet: TDataPacket<TInput>): void;
  /** Get all output from this node */
  getOuput(): TDataPacket<TOutput>;
  /** Set a single entry in the node's ouput */
  setOutput(index: number, entry: TOutput): void;
  /**  */
  clear(): void;
  ready(): boolean;
}

class C2CNode<TInput, TOutput>
  implements TNode<TInput, TOutput>, TLayerInfo, IEquatable<TLayerInfo>, TParticipantInfo {
  outputSize: number;
  inputSize: number;
  input: (TInput | undefined)[];
  output: (TOutput | undefined)[];
  connectedInputInfo: (TConnectionInfo[] | undefined);
  layer: EParticipantRole;
  indexWithinLayer: number;
  name: string;
  room: string;

  equals(other: TLayerInfo): boolean {
    return other.layer === this.layer && other.indexWithinLayer === this.indexWithinLayer
  };
  trySetInput(packet: TDataPacket<TInput>): void {
    this.connectedInputInfo?.forEach((info, index) => {
      if (this.equals(packet.info)) {
        this.input[index] = packet.data[info.indexWithinDataPacket];
        return;
      }
    })
  }
  getOuput(): TDataPacket<TOutput> {
    if (this.output.includes(undefined)) { throw new Error("Output is undefined!") };
    return { info: { layer: this.layer, indexWithinLayer: this.layer }, data: this.output as TOutput[] }
  }
  setOutput(index: number, entry: TOutput): void {
    this.output[index] = entry;
  }
  clear(): void {
    this.input?.fill(undefined);
    this.output?.fill(undefined);
  }
  ready(): boolean {
    return this.input.every(entry => entry !== undefined);
  }

  constructor(participantInfo: TParticipantInfo,
    layerInfo: TLayerInfo,
    inputSize: number,
    outputSize: number,
    connectedInputs: TConnectionInfo[] | undefined) {
    this.room = participantInfo.room;
    this.name = participantInfo.name;
    this.layer = layerInfo.layer;
    this.indexWithinLayer = layerInfo.indexWithinLayer;
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    this.input = new Array<TInput | undefined>(inputSize);
    this.output = new Array<TOutput | undefined>(outputSize);
    this.connectedInputInfo = connectedInputs;
  }
}

export default C2CNode;