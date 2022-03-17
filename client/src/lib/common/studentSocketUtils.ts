import { waitForCondition } from "$lib/shared/common/utils";
import type { TJoinRoomResponse } from "$lib/shared/sockets/socketEvents";
import { socket } from "$lib/stores/socketStore"
import { valueOf } from "$lib/stores/storeUtility"

export const joinRoom = async (room: string, name: string): Promise<TJoinRoomResponse> => {
  let received = false;
  let response: TJoinRoomResponse;
  valueOf(socket).send("joinRoom", [room, name, (resp: TJoinRoomResponse) => {
    received = true;
    response = resp;
  }]);
  await waitForCondition(() => received);
  return response;
}