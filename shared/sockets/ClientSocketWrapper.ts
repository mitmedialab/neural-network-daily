import { io, Socket } from "socket.io-client";
import { removeItem } from "../common/utils";
import type { TDataPacket } from "../graph/C2CNode";
import { TGraphParticipant } from "../graph/graphConfigs";
import type { ServerToClientEvents, ClientToServerEvents, GenericClientSocket } from "./socketEvents";

type TClientsideFunction<TDynamic> = (ServerToClientEvents<TDynamic>[keyof ServerToClientEvents<TDynamic>]);

type TSocketConfig = {
  url?: string;
  onConnect?: () => void;
}

class ClientSocketWrapper<TPacketData> {
  subscriptions: Map<keyof ServerToClientEvents<TPacketData>, TClientsideFunction<TPacketData>[]>;
  socket: Socket<ServerToClientEvents<TPacketData>, ClientToServerEvents<TPacketData>>;

  static FromExisting<TOriginal, TDynamic extends TOriginal>(socket: GenericClientSocket<TOriginal>): ClientSocketWrapper<TDynamic> {
    return new ClientSocketWrapper<TDynamic>(socket as GenericClientSocket<TDynamic>);
  }

  static Connect<TDynamic>(config?: TSocketConfig): ClientSocketWrapper<TDynamic> {
    const socket: Socket<ServerToClientEvents<TDynamic>, ClientToServerEvents<TDynamic>> = config && config.url ? io(config.url) : io();
    const wrapper: ClientSocketWrapper<TDynamic> = new ClientSocketWrapper<TDynamic>(socket);
    if (config && config.onConnect) wrapper.on("connect", config.onConnect);
    return wrapper;
  }

  constructor(socket: Socket<ServerToClientEvents<TPacketData>, ClientToServerEvents<TPacketData>>) {
    this.subscriptions = new Map<keyof ServerToClientEvents<TPacketData>, TClientsideFunction<TPacketData>[]>();
    this.socket = socket;
  }

  close() {
    this.socket.close();
  }

  subscribe<TName extends keyof ServerToClientEvents<TPacketData>>(name: TName, fn: ServerToClientEvents<TPacketData>[TName]): boolean {
    if (this.subscriptions.has(name)) {
      this.subscriptions.get(name)?.push(fn);
      return false;
    } else {
      this.subscriptions.set(name, [fn]);
      return true;
    }
  }

  unsubscribe<TName extends keyof ServerToClientEvents<TPacketData>>(name: TName, fn: ServerToClientEvents<TPacketData>[TName]) {
    const callbacksForEvent = this.subscriptions.get(name);
    if (callbacksForEvent) {
      removeItem(callbacksForEvent, fn);
    }
  }

  on<TName extends keyof ServerToClientEvents<TPacketData>>(name: TName, fn: ServerToClientEvents<TPacketData>[TName]): () => void {
    const key: keyof ServerToClientEvents<TPacketData> = name;
    const mismatchError = () => `Passed in function (${fn.name ?? 'anonymous'}) does not match signature for ${name}`;
    type startType = ServerToClientEvents<TPacketData>["start"];
    type updateType = ServerToClientEvents<TPacketData>["update"];
    type connectType = ServerToClientEvents<TPacketData>["connect"];
    type predictionType = ServerToClientEvents<TPacketData>["prediction"];
    type addParticipantType = ServerToClientEvents<TPacketData>["addParticipant"];
    switch (key) {
      case "connect":
        if (!this.checkType<connectType>(fn)) throw new Error(mismatchError());
        if (this.subscribe(name, fn)) {
          this.socket.on("connect", () => {
            this.subscriptions.get(name)?.forEach(func => (func as connectType)());
          });
        }
        return () => this.unsubscribe(name, fn);
      case "start":
        if (!this.checkType<startType>(fn)) throw new Error(mismatchError());
        if (this.subscribe(name, fn)) {
          this.socket.on("start", () => {
            this.subscriptions.get(name)?.forEach(func => (func as ServerToClientEvents<TPacketData>["start"])());
          });
        };
        return () => this.unsubscribe(name, fn);
      case "update":
        if (!this.checkType<updateType>(fn)) throw new Error(mismatchError());
        if (this.subscribe(name, fn)) {
          this.socket.on("update", (packet: TDataPacket<any>) => {
            this.subscriptions.get(name)?.forEach(func => (func as ServerToClientEvents<TPacketData>["update"])(packet));
          });
        };
        return () => this.unsubscribe(name, fn);
      case "prediction":
        if (!this.checkType<predictionType>(fn)) throw new Error(mismatchError());
        if (this.subscribe(name, fn)) {
          this.socket.on("prediction", (packet: TDataPacket<any>) => {
            this.subscriptions.get(name)?.forEach(func => (func as ServerToClientEvents<TPacketData>["prediction"])(packet));
          });
        };
        return () => this.unsubscribe(name, fn);
      case "addParticipant":
        if (!this.checkType<addParticipantType>(fn)) throw new Error(mismatchError());
        if (this.subscribe(name, fn)) {
          this.socket.on("addParticipant", (participant: TGraphParticipant) => {
            this.subscriptions.get(name)?.forEach(func => (func as ServerToClientEvents<TPacketData>["addParticipant"])(participant));
          });
        };
    }
  }

  send<TName extends keyof ClientToServerEvents<TPacketData>>(name: TName, params: Parameters<ClientToServerEvents<TPacketData>[TName]>): boolean {
    const key: keyof ClientToServerEvents<TPacketData> = name;
    const mismatchError = () => `Passed in parameters (${Object.keys(params)}) does not match signature for ${name}`;

    switch (key) {
      case "joinRoom": {
        type type = Parameters<ClientToServerEvents<TPacketData>["joinRoom"]>;
        const castedParams: type = params as any as type;
        if (castedParams === null) throw new Error(mismatchError());
        this.socket.emit("joinRoom", ...castedParams);
        return true;
      }
      case "startRoom": {
        type type = Parameters<ClientToServerEvents<TPacketData>["startRoom"]>;
        const castedParams: type = params as any as type;
        if (castedParams === null) throw new Error(mismatchError());
        this.socket.emit("startRoom", ...castedParams);
        return true;
      }
      case "checkRoom": {
        type type = Parameters<ClientToServerEvents<TPacketData>["checkRoom"]>;
        const castedParams: type = params as any as type;
        if (castedParams === null) throw new Error(mismatchError());
        this.socket.emit("checkRoom", ...castedParams);
        return true;
      }
      case "propogate": {
        type type = Parameters<ClientToServerEvents<TPacketData>["propogate"]>;
        const castedParams: type = params as any as type;
        if (castedParams === null) throw new Error(mismatchError());
        this.socket.emit("propogate", ...castedParams);
        return true;
      }
      case "testing_getRoomCounts": {
        type type = Parameters<ClientToServerEvents<TPacketData>["testing_getRoomCounts"]>;
        const castedParams: type = params as any as type;
        if (castedParams === null) throw new Error(mismatchError());
        this.socket.emit("testing_getRoomCounts", ...castedParams);
        return true;
      }
    }
  }

  checkType<T>(item: any): boolean { return ((item as unknown) as T) !== null };
}

export default ClientSocketWrapper;