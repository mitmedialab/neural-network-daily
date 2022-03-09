import type Contour from "./TContour"
import { TLayerConfig } from "../graph/graphConfigs";

type TContourSelection = {
  contour: Contour;
  selector: TLayerConfig;
}

export default TContourSelection;