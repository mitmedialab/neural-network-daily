import { io, Socket } from "socket.io-client";
import { Readable, readable } from 'svelte/store';
import type { ServerToClientEvents, ClientToServerEvents } from "$lib/shared/sockets/socketEvents";

const socket: Readable<Socket<ServerToClientEvents, ClientToServerEvents>> = readable(io());
export default socket;