import { createPersistentStore } from '$lib/storeUtility'
import { readable } from 'svelte/store';
import GraphFactory from './shared/graph/GraphFactory';
import { io, Socket } from "socket.io-client";
import type { Readable } from 'svelte/store';
import type { ServerToClientEvents, ClientToServerEvents } from "$lib/shared/sockets/socketEvents";
import type C2CNode from './shared/graph/C2CNode';

export const graphFactory = readable<GraphFactory>(new GraphFactory());
export const socket: Readable<Socket<ServerToClientEvents, ClientToServerEvents>> = readable(io());

export const room = createPersistentStore<string>('room', undefined);
export const role = createPersistentStore<string>('role', undefined);
export const inputs = createPersistentStore<string[]>('inputs', undefined);

