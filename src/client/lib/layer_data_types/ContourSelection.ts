import type Contour from "./Contour"

type TContourSelection = {
  contour: Readonly<Contour>;
  authoringNode: Readonly<Node>;
}

class ContourSelection implements TContourSelection {
  contour: Readonly<Contour>;
  authoringNode: Readonly<Node>;

  constructor(contour: Contour, authoringNode: Node) {
    this.contour = contour;
    this.authoringNode = authoringNode;
  }
}

export default ContourSelection;