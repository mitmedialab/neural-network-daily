<script context="module" lang="ts">
  import type {
    ServerToClientEvents,
    ClientToServerEvents,
  } from "$lib/shared/sockets/socketEvents";
</script>

<script lang="ts">
  import { socket } from "$lib/store";

  const inputMin = 6;
  const inputMax = 50;
  let roomID;

  const startRoom = () => {
    $socket.emit("startRoom", 1, (id: string) => {
      roomID = id;
    });
  };
</script>

<div>Nope you no't</div>
<input type="range" min={inputMin} max={inputMax} />
<button on:click={startRoom} />
