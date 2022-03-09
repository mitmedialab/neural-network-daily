import { io, Socket } from "socket.io-client";
import { removeItem } from "../common/utils";
import type { TDataPacket } from "../graph/C2CNode";
import type { ServerToClientEvents, ClientToServerEvents, GenericClientSocket } from "./socketEvents";

type TClientsideFunction<TDynamic> = (ServerToClientEvents<TDynamic>[keyof ServerToClientEvents<TDynamic>]);

type TSocketConfig = {
  url?: string;
  onConnect?: () => void;
}

class ClientSocketWrapper<TDynamic> {
  subscriptions: Map<keyof ServerToClientEvents<TDynamic>, TClientsideFunction<TDynamic>[]>;
  socket: Socket<ServerToClientEvents<TDynamic>, ClientToServerEvents<TDynamic>>;

  static FromExisting<TOriginal, TDynamic extends TOriginal>(socket: GenericClientSocket<TOriginal>): ClientSocketWrapper<TDynamic> {
    return new ClientSocketWrapper<TDynamic>(socket as GenericClientSocket<TDynamic>);
  }

  static New<TDynamic>(config?: TSocketConfig): ClientSocketWrapper<TDynamic> {
    const socket: Socket<ServerToClientEvents<TDynamic>, ClientToServerEvents<TDynamic>> = config && config.url ? io(config.url) : io();
    const wrapper: ClientSocketWrapper<TDynamic> = new ClientSocketWrapper<TDynamic>(socket);
    if (config && config.onConnect) wrapper.on("connect", config.onConnect);
    return wrapper;
  }

  constructor(socket: Socket<ServerToClientEvents<TDynamic>, ClientToServerEvents<TDynamic>>) {
    this.subscriptions = new Map<keyof ServerToClientEvents<TDynamic>, TClientsideFunction<TDynamic>[]>();
    this.socket = socket;
  }

  close() {
    this.socket.close();
  }

  subscribe<TName extends keyof ServerToClientEvents<TDynamic>>(name: TName, fn: ServerToClientEvents<TDynamic>[TName]): boolean {
    if (this.subscriptions.has(name)) {
      this.subscriptions.get(name)?.push(fn);
      return false;
    } else {
      this.subscriptions.set(name, [fn]);
      return true;
    }
  }

  unsubscribe<TName extends keyof ServerToClientEvents<TDynamic>>(name: TName, fn: ServerToClientEvents<TDynamic>[TName]) {
    const callbacksForEvent = this.subscriptions.get(name);
    if (callbacksForEvent) {
      removeItem(callbacksForEvent, fn);
    }
  }

  on<TName extends keyof ServerToClientEvents<TDynamic>>(name: TName, fn: ServerToClientEvents<TDynamic>[TName]): boolean {
    const key: keyof ServerToClientEvents<TDynamic> = name;
    const mismatchError = () => `Passed in function (${fn.name ?? 'anonymous'}) does not match signature for ${name}`;
    type startType = ServerToClientEvents<TDynamic>["start"];
    type updateType = ServerToClientEvents<TDynamic>["update"];
    type connectType = ServerToClientEvents<TDynamic>["connect"];
    switch (key) {
      case "connect":
        if (!this.checkType<connectType>(fn)) throw new Error(mismatchError());
        if (this.subscribe(name, fn)) {
          this.socket.on("connect", () => {
            this.subscriptions.get(name)?.forEach(func => (func as connectType)());
          });
        }
        return true;
      case "start":
        if (!this.checkType<startType>(fn)) throw new Error(mismatchError());
        if (this.subscribe(name, fn)) {
          this.socket.on("start", () => {
            this.subscriptions.get(name)?.forEach(func => (func as ServerToClientEvents<TDynamic>["start"])());
          });
        };
        return true;
      case "update":
        if (!this.checkType<updateType>(fn)) throw new Error(mismatchError());
        if (this.subscribe(name, fn)) {
          this.socket.on("update", (packet: TDataPacket<any>) => {
            this.subscriptions.get(name)?.forEach(func => (func as ServerToClientEvents<TDynamic>["update"])(packet));
          });
        };
        return true;
    }
  }

  send<TName extends keyof ClientToServerEvents<TDynamic>>(name: TName, params: Parameters<ClientToServerEvents<TDynamic>[TName]>): boolean {
    const key: keyof ClientToServerEvents<TDynamic> = name;
    const mismatchError = () => `Passed in parameters (${Object.keys(params)}) does not match signature for ${name}`;

    switch (key) {
      case "joinRoom": {
        type type = Parameters<ClientToServerEvents<TDynamic>["joinRoom"]>;
        const castedParams: type = params as any as type;
        if (castedParams === null) throw new Error(mismatchError());
        this.socket.emit("joinRoom", ...castedParams);
        return true;
      }
      case "startRoom": {
        type type = Parameters<ClientToServerEvents<TDynamic>["startRoom"]>;
        const castedParams: type = params as any as type;
        if (castedParams === null) throw new Error(mismatchError());
        this.socket.emit("startRoom", ...castedParams);
        return true;
      }
      case "checkRoom": {
        type type = Parameters<ClientToServerEvents<TDynamic>["checkRoom"]>;
        const castedParams: type = params as any as type;
        if (castedParams === null) throw new Error(mismatchError());
        this.socket.emit("checkRoom", ...castedParams);
        return true;
      }
      case "propogate": {
        type type = Parameters<ClientToServerEvents<TDynamic>["propogate"]>;
        const castedParams: type = params as any as type;
        if (castedParams === null) throw new Error(mismatchError());
        this.socket.emit("propogate", ...castedParams);
        return true;
      }
    }
  }

  checkType<T>(item: any): boolean { return ((item as unknown) as T) !== null };
}

export default ClientSocketWrapper;