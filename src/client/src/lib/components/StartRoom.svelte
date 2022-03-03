<script context="module" lang="ts">
  import type {
    ServerToClientEvents,
    ClientToServerEvents,
  } from "$lib/shared/sockets/socketEvents";
</script>

<script lang="ts">
  import socket from "$lib/socketStore";
  import { room } from "$lib/activityStore";

  const inputMin = 6;
  const inputMax = 50;
  let roomID;

  const startRoom = () => {
    $socket.emit("startRoom", 1, (id: string) => {
      roomID = id;
    });
  };
</script>

<input type="range" min={inputMin} max={inputMax} />
<button on:click={startRoom} />
