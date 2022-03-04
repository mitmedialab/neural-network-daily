import type Contour from "$lib/contours/Contour";
import type { TContourInfo } from "$lib/contours/Contour";
import AbstractParticipantNode from "$lib/graph/types/AbstractParticipantNode";
import type TNoInput from "$lib/graph/types/TNoInput";
import type TIndexInLayer from "./types/TIndexInLayer";

class InputLayerNode
  extends AbstractParticipantNode<TNoInput, TNoInput, TContourInfo, Contour>
{
}

export default InputLayerNode;

export function GetNode(indexInLayer: TIndexInLayer, networkCapacity: number): InputLayerNode {
  switch (networkCapacity) {
    case 6:
      return new InputLayerNode();

  }
}