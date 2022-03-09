import type EParticipantRole from "../enums/EParticipantRole";
import type { TDataPacket } from "../graph/C2CNode";

export type TStart = () => void;

export interface ServerToClientEvents {
  update: <T extends any>(data: TDataPacket<T>) => void;
  start: () => void;
}

type TPropogate = <T>(data: TDataPacket<T>) => void;
type TPropogateParams = Parameters<TPropogate>;

type TStartRoom = (capcity: number, callback: (roomID: string) => void) => void;
type TStartRoomParams = Parameters<TStartRoom>;

type TJoinRoom = (roomID: string, callback: (role: EParticipantRole) => void) => void;
type TJoinRoomParams = Parameters<TJoinRoom>;

export interface ClientToServerEvents {
  startRoom: TStartRoom;
  joinRoom: TJoinRoom;
  propogate: TPropogate;
}

export interface InterServerEvents {
}

export interface SocketData {
  roomID: string;
  participantRole: number;
}