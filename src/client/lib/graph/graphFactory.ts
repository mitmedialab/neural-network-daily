import type TNode from "$lib/graph/AbstractParticipantNodeactParticipantNode";
import type { TNodeInfo } from "$lib/graph/AbstractParticipantNodeactParticipantNode";
import type TInputLayerData from "$lib/layer_data_types/TInputLayerData";
import type TFirstHiddenLayerData from "$lib/layer_data_types/TFirstHiddenLayerData";
import type TSecondHiddenLayerData from "$lib/layer_data_types/TSecondHiddenLayerData";
import type TOuputLayerData from "$lib/layer_data_types/TOuputLayerData";
import type TNetwork from "./TNetwork";

const defaultInfo: TNodeInfo = {
  id: undefined,
  name: undefined,
  index: -1,
  connectedInputIndices: undefined,
  connectedOutputIndices: undefined,
}

class Network implements TNetwork {
  InputLayer: TNode<TInputLayerData>[];
  FirstHiddenLayer: TNode<TFirstHiddenLayerData>[];
  SecondHiddenLayer: TNode<TSecondHiddenLayerData>[];
  OutputLayer: TNode<TOuputLayerData>[];
}

export const defaultInputLayerNode: TNode<TInputLayerData> = {
  ...defaultInfo,
  currentData: undefined
}

export const defaultFirstHiddenLayerNode: TNode<TFirstHiddenLayerData> = {
  ...defaultInfo,
  currentData: undefined
}

export const defaultSecondHiddenLayerNode: TNode<TSecondHiddenLayerData> = {
  ...defaultInfo,
  currentData: undefined
}

export const defaultOutputLayerNode: TNode<TOuputLayerData> = {
  ...defaultInfo,
  currentData: undefined
}

export function buildNetwork(nodeCount: number): TNetwork {
  if (nodeCount == 6) {
    const network = buildNetwork(4, undefined, 1, 1, true);
    return network;
  }

  if (nodeCount == 7) {

  }

  if (nodeCount == 8) {

  }

  if (nodeCount == 9) {

  }

  if (nodeCount == 10) {
    return buildNetwork(4, 4, 1, 1, true);
  }

  function buildNetwork(inputLayer: number, firstHiddenLayer: number | undefined, secondHiddenLayer: number, outputLayer: number, fullyConnected: boolean): TNetwork {
    const shape: number[] = [];
    shape.push(inputLayer);
    pushIfDefined(shape, firstHiddenLayer);
    shape.push(secondHiddenLayer);
    shape.push(outputLayer);

    const network: TNetwork = {
      InputLayer: Array(inputLayer).fill(defaultInputLayerNode),
      FirstHiddenLayer: firstHiddenLayer ? Array(firstHiddenLayer).fill(defaultFirstHiddenLayerNode) : undefined,
      SecondHiddenLayer: Array(secondHiddenLayer).fill(defaultSecondHiddenLayerNode),
      OutputLayer: Array(outputLayer).fill(defaultOutputLayerNode),
    };

    if (fullyConnected) {
      network.InputLayer.forEach((node: TNode<TInputLayerData>) => {
        node.connectedInputIndices = undefined;
        node.connectedOutputIndices = getIncrementingArray(shape[1]);
      })

      network.FirstHiddenLayer?.forEach((node: TNode<TFirstHiddenLayerData>) => {
        node.connectedInputIndices = getIncrementingArray(shape[0]);
        node.connectedOutputIndices = getIncrementingArray(shape[2]);
      });

      network.SecondHiddenLayer?.forEach((node: TNode<TFirstHiddenLayerData>) => {
        const prevIndex: number = firstHiddenLayer ? 1 : 0;
        const nextIndex: number = firstHiddenLayer ? 3 : 2;
        node.connectedInputIndices = getIncrementingArray(shape[prevIndex]);
        node.connectedOutputIndices = getIncrementingArray(shape[nextIndex]);
      });
    }

    return network;
  }

  function pushIfDefined<T>(arr: T[], item: T): void {
    if (item) arr.push(item);
  }

  const getIncrementingArray = (count: number): number[] => [...Array(count).keys()];
}