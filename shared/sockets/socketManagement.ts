import { Server } from 'socket.io';
import type { Server as httpServer } from 'http'
import type { Server as httpsServer } from 'https'
import { init as initGuidGenerator, getNext as getNextGuid, release as releaseGuid } from '../common/guidGenerator';
import EParticipantRole from '../enums/EParticipantRole';
import { TCombined } from '../graph/inputOutputs';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, GenericServer } from './socketEvents';
import { TGraphConfig } from '../graph/graphConfigs';
import GraphFactory from '../graph/GraphFactory';
import { TLayerInfo } from '../graph/C2CNode';

const capacityByRoom: Map<string, number> = new Map();

function establishSocketServer(server: httpServer | httpsServer): GenericServer<TCombined> {
  const graphFactory: GraphFactory = new GraphFactory();

  initGuidGenerator();
  const socketServer: GenericServer<TCombined> = new Server<ClientToServerEvents<TCombined>, ServerToClientEvents<TCombined>, InterServerEvents, SocketData>(server);

  socketServer.on("connection", (socket) => {
    socket.on("startRoom", (capacity: number, callback: (roomID: string) => void) => {
      const roomID: string = getNextGuid();
      socket.data.roomID = roomID;
      socket.data.participantRole = EParticipantRole.Facilitator;
      socket.join(roomID);
      capacityByRoom.set(roomID, capacity);
      callback(roomID);
    });

    socket.on("checkRoom", (roomID: string, callback: (success: boolean) => void) => {
      callback(capacityByRoom.has(roomID));
    });

    socket.on("joinRoom", (roomID: string, callback: (role: EParticipantRole) => void) => {
      if (capacityByRoom.has(roomID)) {
        const config: TGraphConfig = graphFactory.getConfig(capacityByRoom.get(roomID) as number);
        //graphFactory.getNodeInfoAtPosition(config,);
        const participantRole: EParticipantRole = EParticipantRole.HiddenLayer1;
        socket.join(roomID);
        socket.data.roomID = roomID;
        socket.data.participantRole = participantRole;
        callback(participantRole);
      }
    });
    socket.broadcast
  });

  return socketServer;
}

/*
const getOpenNodes = (server: GenericServer<TCombined>, room: string): TLayerInfo[] => {
  const i = server.sockets.adapter.rooms.get(room);
  if (!i) return [];
}*/

export const getSizeOfRoom = (server: GenericServer<TCombined>, room: string): number => {
  return server.sockets.adapter.rooms.get(room)?.size ?? 0;
}

export default establishSocketServer;