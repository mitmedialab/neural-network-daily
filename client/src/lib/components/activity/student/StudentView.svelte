<script lang="ts">
  import { joinRoom } from "$lib/common/studentSocketUtils";
  import { room, name as nameStore } from "$lib/stores/activityStore";
  import NeuralNetwork from "../common/NeuralNetwork.svelte";

  let name: string;
  let joining = false;

  const join = () => {
    nameStore.set(name);
    joining = true;
  };
</script>

{#if !$nameStore}
  <input type="text" bind:value={name} />
  <button disabled={!name} on:click={join}>Join</button>
{/if}

{#if joining}
  {#await joinRoom($room, $nameStore) then response}
    {#if response.success}
      <NeuralNetwork capacity={response.onSuccess?.config.capacity} />
    {:else}{response.failure}{/if}
  {/await}
{/if}
