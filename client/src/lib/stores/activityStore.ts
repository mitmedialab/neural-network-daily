import type EParticipantRole from "$lib/shared/enums/EParticipantRole";
import type C2CNode from "$lib/shared/graph/C2CNode";
import type { TLayerInfo } from "$lib/shared/graph/C2CNode";
import type { TGraphState } from "$lib/shared/graph/graphConfigs";
import type { TCombined } from "$lib/shared/graph/inputOutputs";
import { get, writable } from "svelte/store";

export type TActivityInstanceInfo = {
  role: EParticipantRole,
  indexWithinLayer?: number,
  name?: string,
  capacity?: number,
}


export const room = writable<string>();
export const name = writable<string>();
export const capacity = writable<number>();
export const role = writable<EParticipantRole>();
export const nodeInfo = writable<TLayerInfo>();
export const node = writable<C2CNode<TCombined, TCombined>>();

type TNameMap = Map<EParticipantRole, Record<number, string>>;
export const nameMap = writable<TNameMap>(new Map());
export const graphState = writable<TGraphState>();

graphState.subscribe((state) => {
  if (!state) return;
  const map = get(nameMap);
  for (const { layer, indexWithinLayer, participantName } of state.values()) {
    if (map.has(layer)) {
      map.get(layer)[indexWithinLayer] = participantName;
      continue;
    }
    map.set(layer, { [indexWithinLayer]: participantName });
  }
  nameMap.set(map);
});