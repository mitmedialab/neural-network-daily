import type EParticipantRole from '$lib/enums/EParticipantRole';

type TNode = {
  indexWithinLayer: Readonly<number>;
  layer: Readonly<EParticipantRole>;
}

class Node implements TNode {
  indexWithinLayer: Readonly<number>;
  layer: Readonly<EParticipantRole>;

  constructor(layer: EParticipantRole, indexWithinLayer: number) {
    this.layer = layer;
    this.indexWithinLayer = indexWithinLayer;
  }
}
export default Node;