<script lang="ts">
  import { rgbToHex, TColor } from "$lib/colors";

  import displayable from "$lib/components/activity/layerDisplay/canvases/displayable.ts";
  import type { TCoordinate } from "$lib/shared/contours/TContour";

  export let width: number;
  export let height: number;
  export let size: number;
  export let path: TCoordinate[];
  export let color: TColor;

</script>

<canvas
  use:displayable={{
    width,
    height,
    size,
    color: rgbToHex(color),
    path,
  }} />
