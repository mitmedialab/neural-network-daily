import type EParticipantRole from "../enums/EParticipantRole";

export interface ServerToClientEvents {
}

export interface ClientToServerEvents {
  startRoom: (capcity: number, callback: (roomID: string) => void) => void;
  joinRoom: (roomID: string, callback: (role: EParticipantRole) => void) => void;
}

export interface InterServerEvents {
}

export interface SocketData {
  roomID: string;
  participantRole: number;
}