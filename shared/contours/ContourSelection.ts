import type Contour from "./Contour"
import type IEquatable from "../common/IEquatable";
import type TSimpleNode from "../graph/types/ISimpleNode"

export type TContourSelectionInfo = IEquatable<TContourSelectionInfo> & {
  authoringNode: Readonly<TSimpleNode>;
}

export type TContourSelection = {
  contour: Readonly<Contour>;
}

class ContourSelection implements TContourSelection, TContourSelectionInfo {
  contour: Readonly<Contour>;
  authoringNode: Readonly<TSimpleNode>;

  constructor(contour: Contour, authoringNode: TSimpleNode) {
    this.contour = contour;
    this.authoringNode = authoringNode;
  }
  equals: (other: TContourSelectionInfo) => boolean = function (other: TContourSelectionInfo) {
    return this.authoringNode.equals(other.authoringNode);
  }
}

export default ContourSelection;