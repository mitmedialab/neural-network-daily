<script lang="ts">
  import { goto } from "$app/navigation";
  import { room, name } from "$lib/stores/activityStore";
  import { socket } from "$lib/stores/socketStore";
  import { onMount } from "svelte";

  export let id: string = "";
  let roomId: string;
  let roomValid: boolean;
  let userName: string;

  type TInputChangeEvent = Event & {
    currentTarget: EventTarget & HTMLInputElement;
  };

  const checkRoom = (currentId) => {
    $socket.send("checkRoom", [
      currentId,
      (success: boolean) => {
        roomValid = success;
      },
    ]);
  };

  const onRoomInputChange = (event: TInputChangeEvent) => {
    const currentId = event.currentTarget.value;
    checkRoom(currentId);
  };

  const goToRoom = () => {
    name.set(userName);
    room.set(roomId);
    goto(`${roomId}`);
  };

  let readyToJoin: boolean = false;
  $: readyToJoin = userName && roomValid;

  onMount(() => checkRoom(id));
</script>

Name:
<input placeholder="name" bind:value={userName} />
Room:
<input placeholder="room" bind:value={roomId} on:input={onRoomInputChange} />

<button disabled={!readyToJoin} on:click={goToRoom}>Join</button>
