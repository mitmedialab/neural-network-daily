import TContour from "../contours/TContour.js";
import TContourSelection from "../contours/TContourSelection.js";
import EImageClassification from "../enums/EImageClassification.js";

export type TInputLayerInput = undefined;
export type TInputLayerOuput = TContour;

export type THiddenLayer1Input = TContour;
export type THiddenLayer1Output = TContourSelection;

export type THiddenLayer2Input = TContourSelection;
export type THiddenLayer2Output = TContourSelection;

export type TOutputLayerInput = TContourSelection;
export type TOutputLayerOutput = EImageClassification;

export type TCombined =
  TInputLayerInput |
  TInputLayerOuput |
  THiddenLayer1Input |
  THiddenLayer1Output |
  THiddenLayer2Input |
  THiddenLayer2Output |
  TOutputLayerInput |
  TOutputLayerOutput;