<script lang="ts" context="module">
  export type TPath = TCoordinate[];
  export type TPathUpdated = {
    pathUpdate: TCoordinate[];
  };

</script>

<script lang="ts">
  import drawable from "$lib/components/activity/layerDisplay/canvases/drawable.ts";
  import displayable from "$lib/components/activity/layerDisplay/canvases/displayable.ts";

  import type { TEdge } from "$lib/components/activity/layerDisplay/canvases/drawable.ts";
  import type { TCoordinate } from "$lib/shared/contours/TContour";
  import { rgbToHex } from "$lib/colors";
  import type { TColor } from "$lib/colors";
  import { createEventDispatcher } from "svelte";

  export const path: TCoordinate[] = [];
  export let color: TColor = { red: 168, green: 222, blue: 0 };
  export let width: number = 400;
  export let size: number = 4;
  export let src: string = "./elephant.jpg";
  export let height: number;
  export let enabled: boolean = true;
  export function clearPath() {
    path.length = 0;
    context?.clearRect(0, 0, width, height);
  }

  export let displayPaths: TPath[];
  export let displayColor: TColor = { red: 0, green: 0, blue: 0 };

  const dispatcher = createEventDispatcher<TPathUpdated>();

  let image: HTMLImageElement;
  $: height = image ? (image.naturalHeight * width) / image.naturalWidth : 0;

  const container = true;
  const item = true;

  const onDraw = (edge: TEdge) => {
    if (path.length == 0) {
      path.push(edge.from);
      path.push(edge.to);
    } else {
      const last = path[path.length - 1];
      if (last.x !== edge.to.x || last.y !== edge.to.y) {
        path.push(edge.to);
      }
    }

    dispatcher("pathUpdate", path);
  };

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  $: context = canvas?.getContext("2d");

</script>

<style>
  .container {
    display: grid;
    grid-template-columns: 1;
    grid-template-rows: 1;
    border: 2px solid white;
  }

  .item {
    grid-row: 1;
    grid-column: 1;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
    cursor: crosshair;
  }

</style>

<div class:container>
  <img class:item bind:this={image} {src} style="width: {width}px" />
  {#if displayPaths}
    {#each displayPaths as displayPath}
      <canvas
        class:item
        use:displayable={{
          width,
          height,
          size,
          path: displayPath,
          color: rgbToHex(displayColor),
        }} />
    {/each}
  {/if}
  {#if enabled}
    <canvas
      bind:this={canvas}
      on:mouseup
      class:item
      use:drawable={{
        width,
        height,
        size,
        color: rgbToHex(color),
        onDraw,
      }} />
  {:else}
    <canvas
      class:item
      use:displayable={{
        width,
        height,
        size,
        path,
        color: rgbToHex(color),
      }} />
  {/if}
</div>
