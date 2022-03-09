import type EParticipantRole from "../enums/EParticipantRole";
import type { TDataPacket } from "../graph/C2CNode";
import type TContour from "../contours/TContour";
import type TContourSelection from "../contours/TContourSelection";
import type { Socket as ClientSocket } from "socket.io-client";
import type { Socket as ServerSocket } from "socket.io";


export interface ServerToClientEvents<TDynamic> {
  update: <T extends TDynamic>(data: TDataPacket<T>) => void;
  start: () => void;
  connect: () => void;
}

export interface ClientToServerEvents<TDynamic> {
  startRoom: (capcity: number, callback: (roomID: string) => void) => void;
  joinRoom: (roomID: string, callback: (role: EParticipantRole) => void) => void;
  propogate: <T extends TDynamic>(data: TDataPacket<T>) => void;
}

export type GenericClientSocket<TDynamic> = ClientSocket<ServerToClientEvents<TDynamic>, ClientToServerEvents<TDynamic>>;
export type GenericServerSocket<TDynamic> = ServerSocket<ClientToServerEvents<TDynamic>, ServerToClientEvents<TDynamic>>;

export interface InterServerEvents {
}

export interface SocketData {
  roomID: string;
  participantRole: number;
}