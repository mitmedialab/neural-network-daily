<script lang="ts">
  import { goto } from "$app/navigation";

  import { joinRoom } from "$lib/common/studentSocketUtils";
  import { toInfo } from "$lib/shared/sockets/socketEvents";
  import { room, name } from "$lib/stores/activityStore";
  import { socket } from "$lib/stores/socketStore";
  import { onMount } from "svelte";
  import NeuralNetwork from "../common/NeuralNetwork.svelte";

  const handleBadAccess = () => {
    if (!$name) goto("/");
  };

  onMount(handleBadAccess);

</script>

Student
{#if $name}
  {#await joinRoom($room, $name) then response}
    {#if response.success}
      <NeuralNetwork
        capacity={response.onSuccess?.config.capacity}
        self={{
          participantName: $name,
          socketID: $socket.socket.id,
          ...toInfo(response),
        }} />
    {:else}{response.failure}{/if}
  {/await}
{/if}
