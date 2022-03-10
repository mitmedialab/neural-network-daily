import { Server } from 'socket.io';
import type { Server as httpServer } from 'http'
import type { Server as httpsServer } from 'https'
import { init as initGuidGenerator, getNext as getNextGuid, release as releaseGuid } from '../common/guidGenerator';
import EParticipantRole from '../enums/EParticipantRole';
import { TCombined } from '../graph/inputOutputs';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, GenericServer, TJoinRoomResponse, EJoinRoomFailure } from './socketEvents';
import { TGraphConfig, TGraphMap } from '../graph/graphConfigs';
import GraphFactory from '../graph/GraphFactory';
import { TLayerInfo } from '../graph/C2CNode';

function establishSocketServer(server: httpServer | httpsServer): GenericServer<TCombined> {
  const graphFactory: GraphFactory = new GraphFactory();
  type TRoomData = { config: TGraphConfig; graph: TGraphMap };
  const graphByRoom: Map<string, TRoomData> = new Map<string, TRoomData>();

  initGuidGenerator();
  const socketServer: GenericServer<TCombined> = new Server<ClientToServerEvents<TCombined>, ServerToClientEvents<TCombined>, InterServerEvents, SocketData>(server);

  socketServer.on("connection", (socket) => {
    socket.on("disconnect", () => {
      if (socket.data.roomID) {
        if (socket.data.participantRole == EParticipantRole.Facilitator) {

        } else {

        }
      } else {
        console.log("disconnecting unroomed");
      }
    })

    socket.on("startRoom", (capacity: number, callback: (roomID: string) => void) => {
      const roomID: string = getNextGuid();
      socket.data.roomID = roomID;
      socket.data.participantRole = EParticipantRole.Facilitator;
      socket.join(roomID);
      const config = graphFactory.getConfig(capacity);
      graphByRoom.set(roomID, { config, graph: graphFactory.getEmptyGraphMap(config) });
      callback(roomID);
    });

    socket.on("checkRoom", (roomID: string, callback: (success: boolean) => void) => {
      callback(graphByRoom.has(roomID));
    });

    socket.on("joinRoom", (roomID: string, callback: (reponse: TJoinRoomResponse) => void) => {
      if (graphByRoom.has(roomID)) {
        const { config, graph } = graphByRoom.get(roomID) as TRoomData;
        const result = graphFactory.tryAddToFirstEmptyNode(graph, config, socket.id);
        const { success } = result;
        if (success) {
          const { layer, indexWithinLayer } = result.info;
          socket.data.participantRole = layer;
          socket.data.indexWithinLayer = indexWithinLayer;
          socket.data.roomID = roomID;
          socket.join(roomID);
          callback({ success, indexWithinLayer, layer })
        } else {
          callback({ success, failure: EJoinRoomFailure.RoomAtCapacity })
        }
      } else {
        callback({ success: false, failure: EJoinRoomFailure.NoSuchRoom })
      }
    });
    socket.broadcast
  });

  return socketServer;
}

export const getSizeOfRoom = (server: GenericServer<TCombined>, room: string): number => {
  return server.sockets.adapter.rooms.get(room)?.size ?? 0;
}

export const getTotalNumberOfSockets = (server: GenericServer<TCombined>): number => server.sockets.sockets.size;

export default establishSocketServer;