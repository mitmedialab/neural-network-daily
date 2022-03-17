import type EParticipantRole from "$lib/shared/enums/EParticipantRole";
import type C2CNode from "$lib/shared/graph/C2CNode";
import type { TLayerInfo } from "$lib/shared/graph/C2CNode";
import type { TGraphConfig } from "$lib/shared/graph/graphConfigs";
import type { TCombined } from "$lib/shared/graph/inputOutputs";
import { writable } from "svelte/store";

export type TActivityInstanceInfo = {
  role: EParticipantRole,
  indexWithinLayer?: number,
  name?: string,
  capacity?: number,
}

export const room = writable<string>();
export const name = writable<string>();
export const roomInfo = writable<TGraphConfig>();
export const role = writable<EParticipantRole>();
export const nodeInfo = writable<TLayerInfo>();
export const node = writable<C2CNode<TCombined, TCombined>>();