import type TNode from "./TNode";

export type TContour = {
  edges: Readonly<number[]>;
  authoringNode: Readonly<TNode>;
  indexWithinNode: Readonly<number>;
  globalContourIndex: Readonly<number>;
}

class Contour implements TContour {
  edges: Readonly<number[]>;
  authoringNode: Readonly<TNode>;
  indexWithinNode: Readonly<number>;
  globalContourIndex: Readonly<number>;

  constructor(edges: number[], authoringNode: TNode, indexWithinNode: number) {
    this.edges = edges;
    this.authoringNode = authoringNode;
    this.indexWithinNode = indexWithinNode;
    this.globalContourIndex = indexWithinNode + authoringNode.indexWithinLayer;
  }
}

export default Contour;