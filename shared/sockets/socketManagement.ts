import { Server } from 'socket.io';
import type { Server as httpServer } from 'http'
import type { Server as httpsServer } from 'https'
import GuidGenerator from '../common/GuidGenerator';
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
  const guidGenerator: GuidGenerator = new GuidGenerator();
  const socketServer: GenericServer<TCombined> = new Server<ClientToServerEvents<TCombined>, ServerToClientEvents<TCombined>, InterServerEvents, SocketData>(server);

  socketServer.on("connection", (socket) => {
    socket.on("disconnect", () => {
      if (socket.data.roomID) {
        const { roomID, participantRole, indexWithinLayer } = socket.data;
        if (participantRole !== EParticipantRole.Facilitator) {
          const graph = graphByRoom.get(roomID)?.graph as TGraphMap;
          const node = { layer: participantRole as EParticipantRole, indexWithinLayer: indexWithinLayer as number };
          graphFactory.removeNode(graph, node);
        }
        if (getSizeOfRoom(socketServer, roomID) === 0) {
          guidGenerator.release(roomID);
          if (!graphByRoom.delete(roomID)) throw new Error(`Unable to delete room: ${roomID}`);
        }
      }
    })

    socket.on("startRoom", (capacity: number, callback: (roomID: string) => void) => {
      const roomID: string = guidGenerator.getNext();
      socket.data.roomID = roomID;
      socket.data.participantRole = EParticipantRole.Facilitator;
      socket.join(roomID);
      const config = graphFactory.getConfig(capacity);
      graphByRoom.set(roomID, { config, graph: graphFactory.getEmptyGraphMap(config) });
      callback(roomID);
    });

    socket.on("checkRoom", (roomID: string, callback: (success: boolean) => void) => {
      callback(graphByRoom.has(roomID) && roomExists(socketServer, roomID));
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

    socket.on("testing_getRoomCounts", (callback: (map: Record<string, number>) => void) => {
      const toReturn: Record<string, number> = {};
      for (const [room, data] of Array.from(graphByRoom)) {
        toReturn[room] = graphFactory.getNumberOfActiveNodes(data.graph);
      }
      callback(toReturn);
    });
  });

  return socketServer;
}

export const roomExists = (server: GenericServer<TCombined>, room: string): boolean => {
  return server.sockets.adapter.rooms.get(room) !== undefined;
}

export const getSizeOfRoom = (server: GenericServer<TCombined>, room: string): number => {
  return server.sockets.adapter.rooms.get(room)?.size ?? 0;
}

export const getTotalNumberOfSockets = (server: GenericServer<TCombined>): number => server.sockets.sockets.size;

export default establishSocketServer;