<script context="module" lang="ts">
  import type {
    ServerToClientEvents,
    ClientToServerEvents,
  } from "$lib/sockets/socketEvents";

</script>

<script lang="ts">
  import { io, Socket } from "socket.io-client";
  import socket from "./socketStore";
  import { room } from "$lib/activity_store";
  import { onMount } from "svelte";

  let roomID;

  const startRoom = () => {
    $socket.emit("startRoom", 1, (id: string) => {
      roomID = id;
    });
  };

</script>

<button on:click={startRoom} />
