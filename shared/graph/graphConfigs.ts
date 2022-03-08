import EParticipantRole from "../enums/EParticipantRole"

export type TLayerConfig = {
  nodeCount: number,
  outputsPerNode: number,
}

export type TGraphConfig = Record<EParticipantRole, TLayerConfig | undefined> & {
  capacity: number;
  depth: number;
};

abstract class BaseConfig implements TGraphConfig {
  abstract capacity: number;
  abstract depth: number;
  abstract [EParticipantRole.InputLayer]: TLayerConfig | undefined;
  abstract [EParticipantRole.HiddenLayer1]: TLayerConfig | undefined;
  abstract [EParticipantRole.HiddenLayer2]: TLayerConfig | undefined;
  [EParticipantRole.OutputLayer]: TLayerConfig | undefined = {
    nodeCount: 1,
    outputsPerNode: 1,
  };
  [EParticipantRole.Facilitator]: TLayerConfig | undefined = undefined;
}

export class Capacity6 extends BaseConfig {
  capacity = 6;
  depth = 3;
  [EParticipantRole.InputLayer] = {
    nodeCount: 3,
    outputsPerNode: 2,
  };
  [EParticipantRole.HiddenLayer1] = {
    nodeCount: 2,
    outputsPerNode: 2,
  };
  [EParticipantRole.HiddenLayer2] = undefined;
}

export class Capacity7 extends BaseConfig {
  capacity = 7;
  depth = 3;
  [EParticipantRole.InputLayer] = {
    nodeCount: 4,
    outputsPerNode: 2,
  };
  [EParticipantRole.HiddenLayer1] = {
    nodeCount: 2,
    outputsPerNode: 2,
  };
  [EParticipantRole.HiddenLayer2] = undefined;
}

export class Capacity8 extends BaseConfig {
  capacity = 8;
  depth = 4;
  [EParticipantRole.InputLayer] = {
    nodeCount: 4,
    outputsPerNode: 2,
  };
  [EParticipantRole.HiddenLayer1] = {
    nodeCount: 4,
    outputsPerNode: 3,
  };
  [EParticipantRole.HiddenLayer2] = {
    nodeCount: 1,
    outputsPerNode: 4,
  };
}

export class Capacity9 extends BaseConfig {
  capacity = 9;
  depth = 4;
  [EParticipantRole.InputLayer] = {
    nodeCount: 4,
    outputsPerNode: 3,
  };
  [EParticipantRole.HiddenLayer1] = {
    nodeCount: 3,
    outputsPerNode: 2,
  };
  [EParticipantRole.HiddenLayer2] = {
    nodeCount: 1,
    outputsPerNode: 4,
  };
}

export class Capacity10 extends BaseConfig {
  capacity = 10;
  depth = 4;
  [EParticipantRole.InputLayer] = {
    nodeCount: 4,
    outputsPerNode: 4,
  };
  [EParticipantRole.HiddenLayer1] = {
    nodeCount: 4,
    outputsPerNode: 2,
  };
  [EParticipantRole.HiddenLayer2] = {
    nodeCount: 1,
    outputsPerNode: 4,
  };
}

export class Capacity11 extends BaseConfig {
  capacity = 11;
  depth = 4;
  [EParticipantRole.InputLayer] = {
    nodeCount: 5,
    outputsPerNode: 4,
  };
  [EParticipantRole.HiddenLayer1] = {
    nodeCount: 4,
    outputsPerNode: 2,
  };
  [EParticipantRole.HiddenLayer2] = {
    nodeCount: 1,
    outputsPerNode: 4,
  };
}

export class Capacity12 extends BaseConfig {
  capacity = 12;
  depth = 4;
  [EParticipantRole.InputLayer] = {
    nodeCount: 6,
    outputsPerNode: 4,
  };
  [EParticipantRole.HiddenLayer1] = {
    nodeCount: 4,
    outputsPerNode: 2,
  };
  [EParticipantRole.HiddenLayer2] = {
    nodeCount: 1,
    outputsPerNode: 4,
  };
}