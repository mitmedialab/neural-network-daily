<script lang="ts">
  import { goto } from "$app/navigation";

  import { joinRoom } from "$lib/common/studentSocketUtils";
  import EParticipantRole from "$lib/shared/enums/EParticipantRole";
  import { toInfo } from "$lib/shared/sockets/socketEvents";
  import type { TSocketInfo } from "$lib/shared/sockets/socketEvents";

  import { room, name, capacity, nodeInfo } from "$lib/stores/activityStore";
  import { socket } from "$lib/stores/socketStore";
  import { onMount } from "svelte";
  import NeuralNetwork from "../common/NeuralNetwork.svelte";

  const handleBadAccess = () => {
    if (!$name) goto("/");
  };

  const socketInfo: TSocketInfo = {
    participantName: $name,
    socketID: $socket.socket.id,
  };

  onMount(handleBadAccess);

  const indexMapper = (i: number): string => {
    switch (i) {
      case 0:
        return "1st";
      case 1:
        return "2nd";
      case 2:
        return "3rd";
      default:
        return `${i + 1}th`;
    }
  };

  const splitPascalCase = (word: string) => {
    var wordRe = /($[a-z])|[A-Z][^A-Z]+/g;
    return word.match(wordRe).join(" ");
  };

</script>

{#if $name}
  {#await joinRoom($room, $name) then response}
    {#if response.success}
      <h2>
        Now playing as the
        {indexMapper(toInfo(response).indexWithinLayer)}
        node of the
        {splitPascalCase(EParticipantRole[toInfo(response).layer])}
      </h2>
      <NeuralNetwork
        capacity={$capacity}
        self={{ ...socketInfo, ...$nodeInfo }} />
    {:else}{response.failure}{/if}
  {/await}
{/if}
