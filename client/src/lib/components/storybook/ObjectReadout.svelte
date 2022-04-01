<script lang="ts">
  import JSONTree from "svelte-json-tree";

  export let value: any;
  export let key: string;

  export let values: any[];
  export let keys: string[];

</script>

<style>
  div {
    border-color: gray;
    border-radius: 1px;
    border-style: solid;
    border-radius: 10px;
    margin-top: 10px;
    padding: 10px;
  }

</style>

<div>
  {#if value}
    <slot />
    {#if key}
      <JSONTree value={value[key]} />
    {:else}
      <JSONTree {value} />
    {/if}
  {/if}
  {#if values}
    <slot />
    {#each values as value, index}
      {#if keys && keys[index]}
        <JSONTree value={value[keys[index]]} />
      {:else}
        <JSONTree {value} />
      {/if}
    {/each}
  {/if}
</div>
