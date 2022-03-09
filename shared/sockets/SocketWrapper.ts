import { io, Socket } from "socket.io-client";
import type TContour from "../contours/TContour";
import type { TDataPacket } from "../graph/C2CNode";
import type { ServerToClientEvents, ClientToServerEvents, TStart } from "./socketEvents";

class SocketWrapper {
  subscriptions: Map<keyof ServerToClientEvents, (ServerToClientEvents[keyof ServerToClientEvents])[]>;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor() {
    this.socket = io();
  }

  on<TName extends keyof ServerToClientEvents, TData = any>(fn: ServerToClientEvents[TName]) {
    if (!this.checkType<keyof ServerToClientEvents>(fn.name)) return;
    const name: keyof ServerToClientEvents = fn.name as keyof ServerToClientEvents;
    if (this.subscriptions.has(name)) {
      this.subscriptions.get(name).push(fn);
    } else {
      this.subscriptions.set(name, [fn]);
      switch (fn.name) {
        case "start":
          this.socket.on(name, () => {
            this.subscriptions.get(name).forEach(func => (func as TStart)());
          });
          return;
        case "update":
          this.socket.on("update", (packet: TDataPacket<any>) => {
            if (!this.checkType<TData[]>(packet.data)) throw new Error(`Improper cast for update `);
            this.subscriptions.get(name).forEach(func => func(packet));
          });
        default:
          throw new Error(`Unsupported server to client event ${name}`);
      }
    }
  }

  send() {

  }

  checkType<T>(item: any): boolean { return ((item as unknown) as T) !== null };
}

const x = new SocketWrapper();

const update = () => 0;
x.on<"update", number>(update);