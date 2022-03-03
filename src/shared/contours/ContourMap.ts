import type Contour from "$lib/contours/Contour";


export type TContourMap = {
  data: Contour[];
  getContour: (globalContourIndex: number) => Contour;
  addContour: (contour: Contour) => void;
  clear: () => void;
};

class ContourMap implements TContourMap {
  data: Contour[];
  getContour = (globalContourIndex: number) => this.data[globalContourIndex];
  addContour = (contour: Contour) => this.data[contour.globalContourIndex] = contour;
  clear = () => Object.keys(this.data).forEach(key => { delete this.data[key] });
  constructor(totalContours: number = 16) {
    this.data = Array<Contour>(totalContours);
  };
}

export default ContourMap;