import type EParticipantRole from "../enums/EParticipantRole";
import type { TDataPacket } from "../graph/C2CNode";
import type { Socket as ClientSocket } from "socket.io-client";
import type { Socket as ServerSocket, Server } from "socket.io";
import { TLayerInfo } from "../graph/C2CNode";


export interface ServerToClientEvents<TDynamic> {
  update: <T extends TDynamic>(data: TDataPacket<T>) => void;
  start: () => void;
  connect: () => void;
}

export interface ClientToServerEvents<TDynamic> {
  startRoom: (capcity: number, callback: (roomID: string) => void) => void;
  joinRoom: (roomID: string, callback: (reponse: TJoinRoomResponse) => void) => void;
  propogate: <T extends TDynamic>(data: TDataPacket<T>) => void;
  checkRoom: (roomID: string, callback: (success: boolean) => void) => void;
}

export interface InterServerEvents {
}

export interface SocketData {
  roomID: string;
  participantRole: EParticipantRole;
  indexWithinLayer: number;
}

export type GenericClientSocket<TDynamic> = ClientSocket<ServerToClientEvents<TDynamic>, ClientToServerEvents<TDynamic>>;
export type GenericServerSocket<TDynamic> = ServerSocket<ClientToServerEvents<TDynamic>, ServerToClientEvents<TDynamic>>;
export type GenericServer<TDynamic> = Server<ClientToServerEvents<TDynamic>, ServerToClientEvents<TDynamic>, InterServerEvents, SocketData>;

export enum EJoinRoomFailure {
  NoSuchRoom,
  RoomAtCapacity
}

export type TJoinRoomResponse = {
  success: boolean;
  failure?: EJoinRoomFailure;
  layer?: EParticipantRole;
  indexWithinLayer?: number;
}

export const toInfo = (response: TJoinRoomResponse): TLayerInfo => ({ layer: response.layer as EParticipantRole, indexWithinLayer: response.indexWithinLayer as number });