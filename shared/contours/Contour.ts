import type IEquatable from "../common/IEquatable";

export type TContourInfo = IEquatable<TContourInfo> & {
  authoringNode: Readonly<ISimpleNode>;
  indexWithinNode: Readonly<TIndexInNode>;
  globalContourIndex: Readonly<number>;
}

export type TContour = {
  edges: Readonly<number[]>;
}

class Contour implements TContourInfo, TContour {
  edges: Readonly<number[]>;
  authoringNode: Readonly<ISimpleNode>;
  indexWithinNode: Readonly<TIndexInNode>;
  globalContourIndex: Readonly<number>;

  constructor(edges: number[], authoringNode: ISimpleNode, indexWithinNode: number) {
    this.edges = edges;
    this.authoringNode = authoringNode;
    this.indexWithinNode = indexWithinNode;
    this.globalContourIndex = indexWithinNode + authoringNode.indexWithinLayer;
  }
  equals: (other: TContourInfo) => boolean = function (other: TContourInfo) {
    return this.authoringNode.equals(other.authoringNode) && this.indexWithinNode == other.indexWithinNode;
  }
}

export default Contour;