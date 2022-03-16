<script context="module" lang="ts">
  import type {
    ServerToClientEvents,
    ClientToServerEvents,
  } from "$lib/shared/sockets/socketEvents";
</script>

<script lang="ts">
  import { range } from "$lib/shared/common/utils";
  import { socket } from "$lib/store";
  import NeuralNetwork from "./NeuralNetwork.svelte";

  let roomID: string = undefined;
  let capacity: number;
  const onStartRoom = (room: string) => {
    roomID = room;
  };

  const getStudentUrl = () => `${window.location}${roomID}`;
</script>

{#if !roomID}
  <label for="capacity">Capacity:</label>
  <select id="capacity" bind:value={capacity}>
    {#each Array.from(range(6, 7)) as capacity}
      <option value={capacity}>{capacity}</option>
    {/each}
  </select>

  <button on:click={() => $socket.send('startRoom', [capacity, onStartRoom])}>
    Start Room
  </button>
{/if}

{#if roomID}
  <h1>Room started with ID: {roomID}</h1>
  <h3>Advise your students to navigate to: {getStudentUrl()}</h3>
  <NeuralNetwork {capacity} />
{/if}
