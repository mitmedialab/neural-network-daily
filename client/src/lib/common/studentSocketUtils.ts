import { waitForCondition } from "$lib/shared/common/utils";
import type { TCombined } from "$lib/shared/graph/inputOutputs";
import type { TJoinRoomResponse } from "$lib/shared/sockets/socketEvents";
import { capacity, graphState, inputSize, node, nodeInfo, outputSize } from "$lib/stores/activityStore";
import { graphFactory } from "$lib/stores/graphStore";
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
  if (response.success) {
    const { state, config, assignment } = response.onSuccess;
    graphState.set(state);
    capacity.set(config.capacity);
    nodeInfo.set(assignment);
    const c2cNode = valueOf(graphFactory).buildNodeForGraph<TCombined, TCombined>(config, assignment);
    node.set(c2cNode);
    inputSize.set(c2cNode.inputSize);
    outputSize.set(c2cNode.outputSize);
  }
  return response;
}