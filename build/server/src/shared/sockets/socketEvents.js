export var EJoinRoomFailure;
(function (EJoinRoomFailure) {
    EJoinRoomFailure[EJoinRoomFailure["NoSuchRoom"] = 0] = "NoSuchRoom";
    EJoinRoomFailure[EJoinRoomFailure["RoomAtCapacity"] = 1] = "RoomAtCapacity";
})(EJoinRoomFailure || (EJoinRoomFailure = {}));
export const toInfo = (response) => ({ layer: response.layer, indexWithinLayer: response.indexWithinLayer });
//# sourceMappingURL=socketEvents.js.map