import TContour from "../contours/TContour";
import TContourSelection from "../contours/TContourSelection";
import EImageClassification from "../enums/EImageClassification";

export type TInputLayerInput = undefined;
export type TInputLayerOuput = TContour;

export type THiddenLayer1Input = TContour;
export type THiddenLayer1Output = TContourSelection;

export type THiddenLayer2Input = TContourSelection;
export type THiddenLayer2Output = TContourSelection;

export type TOutputLayerInput = TContourSelection;
export type TOutputLayerOutput = EImageClassification;