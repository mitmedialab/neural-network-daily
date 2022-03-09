import type Contour from "./TContour"
import { TLayerConfig } from "../graph/graphConfigs";

type TContourSelection = {
  contours: Contour[];
  selector: TLayerConfig;
}

export default TContourSelection;