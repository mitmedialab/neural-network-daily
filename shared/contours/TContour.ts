import type IEquatable from "../common/IEquatable";
import { TLayerConfig } from "../graph/graphConfigs";

export type TCoordinate = {
  x: number;
  y: number;
}

export type TContour = {
  author: TLayerConfig;
  path: TCoordinate[];
}

export default TContour;