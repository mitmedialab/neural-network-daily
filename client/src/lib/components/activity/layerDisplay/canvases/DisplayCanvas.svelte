<script lang="ts">
  import { rgbToHex, TColor } from "$lib/colors";

  import displayable from "$lib/components/activity/layerDisplay/canvases/displayable.ts";
  import type { TCoordinate } from "$lib/shared/contours/TContour";

  export let width: number;
  export let active: boolean;
  export let height: number;
  export let size: number;
  export let color: TColor;
  export let backgroundColor: TColor = { red: 250, green: 229, blue: 192 };
  export function draw(p: TCoordinate[]) {
    path = [...p];
  }
  export function clear() {
    context?.clearRect(0, 0, width, height);
    path = [];
  }

  let path: TCoordinate[];
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  $: context = canvas?.getContext("2d");

  const borderWidth = 3;
  const activeBorderColor = "blue";
  const defaultColor = "grey";
  const activeStyle = `border: ${borderWidth}px solid ${activeBorderColor};`;
  const defaultStyle = `border: ${borderWidth}px solid ${defaultColor};`;

</script>

<style>
  canvas {
    border-radius: 20px;
  }

</style>

<canvas
  bind:this={canvas}
  style={active ? activeStyle : defaultStyle}
  use:displayable={{
    width,
    height,
    size,
    color: rgbToHex(color),
    path,
    fill: rgbToHex(backgroundColor),
  }} />
