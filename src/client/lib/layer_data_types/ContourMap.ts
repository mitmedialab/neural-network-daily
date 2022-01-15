import { element } from "svelte/internal";
import type Contour from "./Contour";

export type TContourMap = {
  data: Record<number, Contour>;
  getContour: (globalContourIndex: number) => Contour;
  addContour: (contour: Contour) => void;
  clear: () => void;
};

class ContourMap implements TContourMap {
  data: Record<number, Contour>;
  getContour = (globalContourIndex: number) => this.data[globalContourIndex];
  addContour = (contour: Contour) => this.data[contour.globalContourIndex] = contour;
  clear = () => Object.keys(this.data).forEach(key => { delete this.data[key] });
}

export default ContourMap;