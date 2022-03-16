<script lang="ts">
  import { goto } from "$app/navigation";
  import { socket } from "$lib/store";
  import { onMount } from "svelte";

  export let id: string = "";
  let room: string;
  let roomValid: boolean;
  let name: string;

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

  const onRoomChange = (event: TInputChangeEvent) => {
    const currentId = event.currentTarget.value;
    checkRoom(currentId);
  };

  let readyToJoin: boolean = false;
  $: readyToJoin = name && roomValid;

  onMount(() => checkRoom(id));
</script>

Name:<input placeholder="name" bind:value={name} />
Room:<input placeholder="room" bind:value={room} on:input={onRoomChange} />

<button disabled={!readyToJoin} on:click={() => goto(`${room}`)}>Join</button>
