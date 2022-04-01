import type EParticipantRole from "../enums/EParticipantRole";
import type { TDataPacket } from "../graph/C2CNode";
import type { Socket as ClientSocket } from "socket.io-client";
import type { Socket as ServerSocket, Server } from "socket.io";
import { TLayerInfo } from "../graph/C2CNode";
import { TGraphConfig, TGraphParticipant, TGraphState } from "../graph/graphConfigs";


export interface ServerToClientEvents<TPacketData> {
  update: <T extends TPacketData>(data: TDataPacket<T>) => void;
  start: () => void;
  connect: () => void;
  addParticipant: (participant: TGraphParticipant) => void;
  prediction: <T extends TPacketData>(data: TDataPacket<T>) => void;
}

export interface ClientToServerEvents<TPacketData> {
  startRoom: (capcity: number, callback: (roomID: string) => void) => void;
  joinRoom: (roomID: string, name: string, callback: (reponse: TJoinRoomResponse) => void) => void;
  propogate: <T extends TPacketData>(data: TDataPacket<T>) => void;
  checkRoom: (roomID: string, callback: (success: boolean) => void) => void;
  testing_getRoomCounts: (callback: (map: Record<string, number>) => void) => void;
}

export interface InterServerEvents {
}

export interface SocketData {
  roomID: string;
  participantRole: EParticipantRole;
  indexWithinLayer: number;
}

export type GenericClientSocket<TPacketData> = ClientSocket<ServerToClientEvents<TPacketData>, ClientToServerEvents<TPacketData>>;
export type GenericServerSocket<TPacketData> = ServerSocket<ClientToServerEvents<TPacketData>, ServerToClientEvents<TPacketData>>;
export type GenericServer<TPacketData> = Server<ClientToServerEvents<TPacketData>, ServerToClientEvents<TPacketData>, InterServerEvents, SocketData>;

export enum EJoinRoomFailure {
  NoSuchRoom,
  RoomAtCapacity
}

export type TJoinRoomResponse = {
  success: boolean;
  failure?: EJoinRoomFailure;
  onSuccess?: {
    assignment: TLayerInfo;
    config: TGraphConfig;
    state: TGraphState;
  }
}

export type TSocketInfo = { socketID: string, participantName: string };

export const toInfo = (response: TJoinRoomResponse): TLayerInfo => response.onSuccess?.assignment as TLayerInfo;