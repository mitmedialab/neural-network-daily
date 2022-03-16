import type Contour from "./TContour"
import { TLayerConfig } from "../graph/graphConfigs";
import { TLayerInfo } from "../../../shared/graph/C2CNode";

type TContourSelection = {
  contours: Contour[];
  selector: TLayerInfo;
}

export default TContourSelection;