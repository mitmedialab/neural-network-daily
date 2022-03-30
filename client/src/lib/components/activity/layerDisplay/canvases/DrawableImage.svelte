<script lang="ts">
  import drawable from "$lib/components/activity/layerDisplay/canvases/drawable.ts";
  import type { TEdge } from "$lib/components/activity/layerDisplay/canvases/drawable.ts";
  import type { TCoordinate } from "$lib/shared/contours/TContour";
  import { rgbToHex } from "$lib/colors";
  import type { TColor } from "$lib/colors";

  export const path: TCoordinate[] = [];
  export let color: TColor = { red: 168, green: 222, blue: 0 };
  export let width: number = 400;
  export let size: number = 4;
  export let src: string = "./elephant.jpg";
  export const clearPath = () => (path.length = 0);
  export let height: number;

  let image: HTMLImageElement;
  $: height = image ? (image.naturalHeight * width) / image.naturalWidth : 0;

  const container = true;
  const item = true;

  const onDraw = (edge: TEdge) => {
    if (path.length == 0) {
      path.push(edge.from);
      path.push(edge.to);
      return;
    }

    const last = path[path.length - 1];
    if (last.x !== edge.to.x || last.y !== edge.to.y) {
      path.push(edge.to);
    }
  };

</script>

<style>
  .container {
    display: grid;
    grid-template-columns: 1;
    grid-template-rows: 1;
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
  }

</style>

<div class:container>
  <img class:item bind:this={image} {src} style="width: {width}px" />
  <canvas
    class:item
    use:drawable={{
      width,
      height,
      size,
      color: rgbToHex(color),
      onDraw,
    }} />
</div>
