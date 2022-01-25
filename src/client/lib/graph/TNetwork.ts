import type TNode from "$lib/graph/AbstractParticipantNodeactParticipantNode";
import type TInputLayerData from "$lib/layer_data_types/TInputLayerData";
import type TFirstHiddenLayerData from "$lib/layer_data_types/TFirstHiddenLayerData";
import type TSecondHiddenLayerData from "$lib/layer_data_types/TSecondHiddenLayerData";
import type TOuputLayerData from "$lib/layer_data_types/TOuputLayerData";

type TNetwork = {
  InputLayer: TNode<TInputLayerData>[];
  FirstHiddenLayer: TNode<TFirstHiddenLayerData>[];
  SecondHiddenLayer: TNode<TSecondHiddenLayerData>[];
  OutputLayer: TNode<TOuputLayerData>[];
};

export default TNetwork;