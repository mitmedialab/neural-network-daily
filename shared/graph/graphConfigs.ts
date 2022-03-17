import type { TSocketInfo } from "../sockets/socketEvents";
import EParticipantRole from "../enums/EParticipantRole"
import { TLayerInfo } from "./C2CNode";

export type TLayerConfig = {
  nodeCount: number,
  outputsPerNode: number,
  contourOuputWidth: number,
}

export type TGraphConfig = Record<EParticipantRole, TLayerConfig | undefined> & {
  capacity: number;
  depth: number;
};

export type TGraphParticipant = (TLayerInfo & TSocketInfo);
export type TGraphState = TGraphParticipant[];
export type TGraphMap<TData> = Map<EParticipantRole, Map<number, TData>>;

abstract class BaseConfig implements TGraphConfig {
  abstract capacity: number;
  abstract depth: number;
  abstract [EParticipantRole.InputLayer]: TLayerConfig | undefined;
  abstract [EParticipantRole.HiddenLayer1]: TLayerConfig | undefined;
  abstract [EParticipantRole.HiddenLayer2]: TLayerConfig | undefined;
  [EParticipantRole.OutputLayer]: TLayerConfig | undefined = {
    nodeCount: 1,
    outputsPerNode: 1,
    contourOuputWidth: 1,
  };
  [EParticipantRole.Facilitator]: TLayerConfig | undefined = undefined;
}

export class Capacity6 extends BaseConfig {
  capacity = 6;
  depth = 3;
  [EParticipantRole.InputLayer] = {
    nodeCount: 3,
    outputsPerNode: 2,
    contourOuputWidth: 2,
  };
  [EParticipantRole.HiddenLayer1] = {
    nodeCount: 2,
    outputsPerNode: 1,
    contourOuputWidth: 2,
  };
  [EParticipantRole.HiddenLayer2] = undefined;
}

export class Capacity7 extends BaseConfig {
  capacity = 7;
  depth = 3;
  [EParticipantRole.InputLayer] = {
    nodeCount: 4,
    outputsPerNode: 2,
    contourOuputWidth: 2,
  };
  [EParticipantRole.HiddenLayer1] = {
    nodeCount: 2,
    outputsPerNode: 1,
    contourOuputWidth: 2,
  };
  [EParticipantRole.HiddenLayer2] = undefined;
}

export class Capacity8 extends BaseConfig {
  capacity = 8;
  depth = 4;
  [EParticipantRole.InputLayer] = {
    nodeCount: 4,
    outputsPerNode: 2,
    contourOuputWidth: 2,
  };
  [EParticipantRole.HiddenLayer1] = {
    nodeCount: 2,
    outputsPerNode: 1,
    contourOuputWidth: 3,
  };
  [EParticipantRole.HiddenLayer2] = {
    nodeCount: 1,
    outputsPerNode: 1,
    contourOuputWidth: 4,
  };
}

export class Capacity9 extends BaseConfig {
  capacity = 9;
  depth = 4;
  [EParticipantRole.InputLayer] = {
    nodeCount: 4,
    outputsPerNode: 3,
    contourOuputWidth: 3,
  };
  [EParticipantRole.HiddenLayer1] = {
    nodeCount: 3,
    outputsPerNode: 1,
    contourOuputWidth: 2,
  };
  [EParticipantRole.HiddenLayer2] = {
    nodeCount: 1,
    outputsPerNode: 1,
    contourOuputWidth: 4,
  };
}

export class Capacity10 extends BaseConfig {
  capacity = 10;
  depth = 4;
  [EParticipantRole.InputLayer] = {
    nodeCount: 4,
    outputsPerNode: 4,
    contourOuputWidth: 4,
  };
  [EParticipantRole.HiddenLayer1] = {
    nodeCount: 4,
    outputsPerNode: 1,
    contourOuputWidth: 2,
  };
  [EParticipantRole.HiddenLayer2] = {
    nodeCount: 1,
    outputsPerNode: 1,
    contourOuputWidth: 4,
  };
}

export class Capacity11 extends BaseConfig {
  capacity = 11;
  depth = 4;
  [EParticipantRole.InputLayer] = {
    nodeCount: 5,
    outputsPerNode: 4,
    contourOuputWidth: 4,
  };
  [EParticipantRole.HiddenLayer1] = {
    nodeCount: 4,
    outputsPerNode: 1,
    contourOuputWidth: 2,
  };
  [EParticipantRole.HiddenLayer2] = {
    nodeCount: 1,
    outputsPerNode: 1,
    contourOuputWidth: 4,
  };
}

export class Capacity12 extends BaseConfig {
  capacity = 12;
  depth = 4;
  [EParticipantRole.InputLayer] = {
    nodeCount: 6,
    outputsPerNode: 4,
    contourOuputWidth: 4,
  };
  [EParticipantRole.HiddenLayer1] = {
    nodeCount: 4,
    outputsPerNode: 1,
    contourOuputWidth: 2,
  };
  [EParticipantRole.HiddenLayer2] = {
    nodeCount: 1,
    outputsPerNode: 1,
    contourOuputWidth: 4,
  };
}