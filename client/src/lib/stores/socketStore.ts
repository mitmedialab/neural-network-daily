import { waitForCondition } from "$lib/shared/common/utils";
import type { TCombined } from "$lib/shared/graph/inputOutputs";
import ClientSocketWrapper from "$lib/shared/sockets/ClientSocketWrapper";
import { readable } from "svelte/store";
import type { Readable } from "svelte/store";

let socketConnected = true;
export const waitForSocket = async () => waitForCondition(() => socketConnected);

export const socket: Readable<ClientSocketWrapper<TCombined>> = readable(ClientSocketWrapper.Connect({
  onConnect: () => socketConnected = true
}));