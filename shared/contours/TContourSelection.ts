import type Contour from "./TContour"
import { TLayerInfo } from "../graph/C2CNode";

type TContourSelection = {
  contours: Contour[];
  selector: TLayerInfo;
}

export default TContourSelection;