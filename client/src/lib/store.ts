import { createPersistentStore } from '$lib/storeUtility'
import { readable } from 'svelte/store';
import GraphFactory from './shared/graph/GraphFactory';
import { io, Socket } from "socket.io-client";
import type { Readable } from 'svelte/store';
import type { ServerToClientEvents, ClientToServerEvents } from "$lib/shared/sockets/socketEvents";
import type C2CNode from './shared/graph/C2CNode';
import type { TCombined } from './shared/graph/inputOutputs';
import ClientSocketWrapper from './shared/sockets/ClientSocketWrapper';
import { waitForCondition } from './shared/common/utils';

export const graphFactory = readable<GraphFactory>(new GraphFactory());

let socketConnected = true;
export const waitForSocket = async () => waitForCondition(() => socketConnected);

export const socket: Readable<ClientSocketWrapper<TCombined>> = readable(ClientSocketWrapper.Connect({
  onConnect: () => socketConnected = true
}));

export const room = createPersistentStore<string>('room', undefined);
export const role = createPersistentStore<string>('role', undefined);
export const inputs = createPersistentStore<string[]>('inputs', undefined);

