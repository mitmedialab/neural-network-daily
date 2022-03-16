import { TLayerInfo } from "../graph/C2CNode";

export type TCoordinate = {
  x: number;
  y: number;
}

export type TContour = {
  author: TLayerInfo;
  path: TCoordinate[];
}

export default TContour;