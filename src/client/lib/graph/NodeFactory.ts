import type EParticipantRole from "$lib/enums/EParticipantRole";
import type { ParticipantInfo } from "./types/AbstractParticipantNode";
import type ISimpleNode from "./types/ISimpleNode";
import type TIndexInLayer from "./types/TIndexInLayer";

export function GetNode
  <TNodeType extends ParticipantInfo & ISimpleNode>
  (layer: EParticipantRole, indexInLayer: TIndexInLayer, networkCapacity: number): TNodeType {
  switch (networkCapacity) {
    case 6:
      return CapacitySix(layer, indexInLayer);

  }
}

function CapacitySix
  <TNodeType extends ParticipantInfo & ISimpleNode>
  (layer: EParticipantRole, indexInLayer: TIndexInLayer): TNodeType {
}

function CapacitySeven(layer: EParticipantRole, indexInLayer: TIndexInLayer) {

}

function CapacityEight(layer: EParticipantRole, indexInLayer: TIndexInLayer) {

}


function CapacityNine(layer: EParticipantRole, indexInLayer: TIndexInLayer) {

}

function CapacityTen(layer: EParticipantRole, indexInLayer: TIndexInLayer) {

}

