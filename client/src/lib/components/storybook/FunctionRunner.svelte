<script lang="ts" context="module">
  import { afterUpdate, onDestroy, onMount } from "svelte";

</script>

<script lang="ts">
  /**
   * Runs on Mount
   */
  export let mountFn: () => void;

  /**
   * Runs on (every) afterUpdate
   */
  export let updateFn: () => void;

  /**
   * Runs on Destroy
   */
  export let destroyFn: () => void;

  const tryRun = (fn: () => void): void => {
    if (fn) {
      try {
        fn();
      } catch (e) {
        alert(e);
      }
    }
  };

  onMount(() => {
    tryRun(mountFn);
    mounted = true;
  });
  afterUpdate(() => tryRun(updateFn));
  onDestroy(() => tryRun(destroyFn));

  let mounted: boolean = false;

</script>

{#if mounted}
  <slot />
{/if}
