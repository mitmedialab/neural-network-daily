import EParticipantRole from "../enums/EParticipantRole"

export type TLayerConfig = {
  nodeCount: number,
  outputsPerNode: number,
}

export type TGraphConfig = Record<EParticipantRole, TLayerConfig | undefined> & {
  capacity: number;
  depth: number;
};

export type TLayerMap = { [key in EParticipantRole]?: TLayerConfig };

function pushIfDefined<T>(arr: T[], item: T): boolean {
  if (item !== undefined) {
    arr.push(item);
    return true;
  }
  return false;
}

function enterIfDefined<TKey extends string | number | symbol, TItem>(obj: { [key in TKey]?: TItem }, key: TKey, item: TItem): boolean {
  if (item !== undefined) {
    obj[key] = item;
    return true;
  }
  return false;
}

const addLayerIfDefined = (container: TLayerConfig[] | TLayerMap, config: TGraphConfig, layer: EParticipantRole): boolean => {
  if (Array.isArray(container)) {
    return pushIfDefined(container, config[layer])
  } else {
    return enterIfDefined(container, layer, config[layer]);
  }
};

export function getLayerConfigCollection(config: TGraphConfig): TLayerConfig[] {
  const layers: TLayerConfig[] = [];
  addLayerIfDefined(layers, config, EParticipantRole.InputLayer);
  addLayerIfDefined(layers, config, EParticipantRole.HiddenLayer1);
  addLayerIfDefined(layers, config, EParticipantRole.HiddenLayer2);
  addLayerIfDefined(layers, config, EParticipantRole.OutputLayer);
  return layers;
};

export function getLayerConfigMap(config: TGraphConfig): { [key in EParticipantRole]?: TLayerConfig } {
  const map: { [key in EParticipantRole]?: TLayerConfig } = {};
  addLayerIfDefined(map, config, EParticipantRole.InputLayer);
  addLayerIfDefined(map, config, EParticipantRole.HiddenLayer1);
  addLayerIfDefined(map, config, EParticipantRole.HiddenLayer2);
  addLayerIfDefined(map, config, EParticipantRole.OutputLayer);
  return map;
}

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
  [EParticipantRole.InputLayer] = undefined;
  [EParticipantRole.HiddenLayer1] = undefined;
  [EParticipantRole.HiddenLayer2] = undefined;

}

export class Capacity9 extends BaseConfig {
  capacity = 9;
  depth = 4;
  [EParticipantRole.InputLayer] = undefined;
  [EParticipantRole.HiddenLayer1] = undefined;
  [EParticipantRole.HiddenLayer2] = undefined;
}

export class Capacity10 extends BaseConfig {
  capacity = 10;
  depth = 4;
  [EParticipantRole.InputLayer] = undefined;
  [EParticipantRole.HiddenLayer1] = undefined;
  [EParticipantRole.HiddenLayer2] = undefined;
}

export class Capacity11 extends BaseConfig {
  capacity = 11;
  depth = 4;
  [EParticipantRole.InputLayer] = undefined;
  [EParticipantRole.HiddenLayer1] = undefined;
  [EParticipantRole.HiddenLayer2] = undefined;
}

export class Capacity12 extends BaseConfig {
  capacity = 12;
  depth = 4;
  [EParticipantRole.InputLayer] = undefined;
  [EParticipantRole.HiddenLayer1] = undefined;
  [EParticipantRole.HiddenLayer2] = undefined;
}