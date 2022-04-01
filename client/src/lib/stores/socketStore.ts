import { waitForCondition } from "$lib/shared/common/utils";
import type { TCombined } from "$lib/shared/graph/inputOutputs";
import ClientSocketWrapper from "$lib/shared/sockets/ClientSocketWrapper";
import { get, readable } from "svelte/store";
import type { Readable } from "svelte/store";
import type EParticipantRole from "$lib/shared/enums/EParticipantRole";
import type { TGraphParticipant } from "$lib/shared/graph/graphConfigs";
import { graphState } from "./activityStore";

let socketConnected = true;
export const waitForSocket = async () => waitForCondition(() => socketConnected);

export const socket: Readable<ClientSocketWrapper<TCombined>> = readable(ClientSocketWrapper.Connect({
  onConnect: () => {
    socketConnected = true;
    const self = get(socket);
    self.on("addParticipant", (participant: TGraphParticipant) => {
      graphState.update(current => current ? [...current, participant] : [participant]);
    });
  }
}));