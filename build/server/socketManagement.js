import { Server } from 'socket.io';
import { devConsole } from './utils/devUtility.js';
import { init as initGuidGenerator, getNext as getNextGuid } from './utils/guidGenerator.js';
import EParticipantRole from './shared/enums/EParticipantRole.js';
const validRoomIDs = [];
function establishSocketServer(server) {
    initGuidGenerator();
    const socketServer = new Server(server);
    socketServer.on("connection", (socket) => {
        devConsole?.log("New conncetion");
        socket.on("startRoom", (capacity, callback) => {
            const roomID = getNextGuid();
            socket.data.roomID = roomID;
            socket.data.participantRole = EParticipantRole.Facilitator;
            socket.join(roomID);
            validRoomIDs.push(roomID);
            callback(roomID);
            devConsole?.log(`Open new room: ${roomID}, with capacity: ${capacity}`);
        });
        socket.on("joinRoom", (roomID, callback) => {
            const participantRole = EParticipantRole.HiddenLayer1;
            socket.data.roomID = roomID;
            socket.data.participantRole = participantRole;
            socket.join(roomID);
            callback(participantRole);
            devConsole?.log(`Socket joined room: ${roomID}, as a: ${participantRole}`);
        });
    });
}
export default establishSocketServer;
