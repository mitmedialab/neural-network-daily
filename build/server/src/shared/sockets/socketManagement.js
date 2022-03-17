import { Server } from 'socket.io';
import GuidGenerator from '../common/GuidGenerator';
import EParticipantRole from '../enums/EParticipantRole';
import { EJoinRoomFailure } from './socketEvents';
import GraphFactory from '../graph/GraphFactory';
import { isDevelopmentMode } from '../common/processUtils';
const testRoom = isDevelopmentMode ? 'test' : undefined;
function establishSocketServer(server) {
    const graphFactory = new GraphFactory();
    const graphByRoom = new Map();
    const guidGenerator = new GuidGenerator();
    const socketServer = new Server(server);
    if (isDevelopmentMode && testRoom) {
        const config = graphFactory.getConfig(6);
        graphByRoom.set(testRoom, { config, graph: graphFactory.getEmptyGraphMap(config) });
    }
    socketServer.on("connection", (socket) => {
        socket.on("disconnect", () => {
            if (socket.data.roomID) {
                const { roomID, participantRole, indexWithinLayer } = socket.data;
                if (participantRole !== EParticipantRole.Facilitator) {
                    const graph = graphByRoom.get(roomID)?.graph;
                    const node = { layer: participantRole, indexWithinLayer: indexWithinLayer };
                    graphFactory.removeNode(graph, node);
                }
                if (getSizeOfRoom(socketServer, roomID) === 0) {
                    guidGenerator.release(roomID);
                    if (!graphByRoom.delete(roomID))
                        throw new Error(`Unable to delete room: ${roomID}`);
                }
            }
        });
        socket.on("startRoom", (capacity, callback) => {
            const roomID = guidGenerator.getNext();
            socket.data.roomID = roomID;
            socket.data.participantRole = EParticipantRole.Facilitator;
            socket.join(roomID);
            const config = graphFactory.getConfig(capacity);
            graphByRoom.set(roomID, { config, graph: graphFactory.getEmptyGraphMap(config) });
            callback(roomID);
        });
        socket.on("checkRoom", (roomID, callback) => {
            callback(graphByRoom.has(roomID) && roomExists(socketServer, roomID));
        });
        socket.on("joinRoom", (roomID, callback) => {
            if (graphByRoom.has(roomID)) {
                const { config, graph } = graphByRoom.get(roomID);
                const result = graphFactory.tryAddToFirstEmptyNode(graph, config, socket.id);
                const { success } = result;
                if (success) {
                    const { layer, indexWithinLayer } = result.info;
                    socket.data.participantRole = layer;
                    socket.data.indexWithinLayer = indexWithinLayer;
                    socket.data.roomID = roomID;
                    socket.join(roomID);
                    callback({ success, indexWithinLayer, layer });
                }
                else {
                    callback({ success, failure: EJoinRoomFailure.RoomAtCapacity });
                }
            }
            else {
                callback({ success: false, failure: EJoinRoomFailure.NoSuchRoom });
            }
        });
        socket.on("propogate", (data) => {
            if (socket.data.roomID) {
                if (socket.data.participantRole === EParticipantRole.OutputLayer) {
                    socket.to(socket.data.roomID).emit("prediction", data);
                }
                else {
                    socket.to(socket.data.roomID).emit("update", data);
                }
            }
        });
        socket.on("testing_getRoomCounts", (callback) => {
            const toReturn = {};
            for (const [room, data] of Array.from(graphByRoom)) {
                toReturn[room] = graphFactory.getNumberOfActiveNodes(data.graph);
            }
            callback(toReturn);
        });
    });
    return socketServer;
}
export const roomExists = (server, room) => {
    if (isDevelopmentMode && testRoom && room === testRoom) {
        return true;
    }
    return server.sockets.adapter.rooms.get(room) !== undefined;
};
export const getSizeOfRoom = (server, room) => {
    return server.sockets.adapter.rooms.get(room)?.size ?? 0;
};
export const getTotalNumberOfSockets = (server) => server.sockets.sockets.size;
export default establishSocketServer;
//# sourceMappingURL=socketManagement.js.map