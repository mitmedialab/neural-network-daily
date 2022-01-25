import { Server } from 'socket.io';
import type { Server as httpServer } from 'http'
import type { Server as httpsServer } from 'https'

import { devConsole } from './devUtility.js';
import { init as initGuidGenerator, getNext as getNextGuid, release as releaseGuid, init } from './guidGenerator.js';
import EParticipantRole from '../client/lib/enums/EParticipantRole.js';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '../client/lib/sockets/socketEvents.js';

/**
 * 
 * @param server 
 */
function establishSocketServer(server: httpServer | httpsServer) {
  initGuidGenerator();
  const socketServer = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server);

  socketServer.on("connection", (socket) => {
    devConsole?.log("New conncetion");

    socket.on("startRoom", (capacity: number, callback: (roomID: string) => void) => {
      const roomID: string = getNextGuid();
      socket.data.roomID = roomID;
      socket.data.participantRole = EParticipantRole.Facilitator;
      callback(roomID);
      devConsole?.log(`Open new room: ${roomID}, with capacity: ${capacity}`);
    });

    socket.on("joinRoom", (roomID: string, callback: (role: EParticipantRole) => void) => {
      const participantRole: EParticipantRole = EParticipantRole.HiddenLayer1;
      socket.data.roomID = roomID;
      socket.data.participantRole = participantRole;
      callback(participantRole);
      devConsole?.log(`Socket joined room: ${roomID}, as a: ${participantRole}`)
    });
  });
}

export default establishSocketServer;