<script lang="ts">
  import { lime } from "$lib/colors";
  import type { TColor } from "$lib/colors";

  import { outputSize } from "$lib/stores/activityStore";
  import DisplayCanvas from "$lib/components/activity/layerDisplay/canvases/DisplayCanvas.svelte";
  import DrawableImage from "$lib/components/activity/layerDisplay/canvases/DrawableImage.svelte";

  const displayCanvases: DisplayCanvas[] = Array<DisplayCanvas>($outputSize);

  const pageContainer = true;
  const displayContainer = true;
  const displayItem = true;
  const imageRow = true;
  const buttonRow = true;
  const imageColumn = true;
  const instructionsColumn = true;

  const width: number = 300;
  const size: number = 4;
  const color: TColor = lime;
  let height: number;
  let path;

</script>

<style>
  .pageContainer {
    height: 100vh;
    width: 100vw;
    background-color: yellow;
  }

  .imageRow {
  }

  .imageRow > * {
    display: inline-block;
  }
  .imageColumn {
  }
  .instructionsColumn {
  }

  .buttonRow {
  }

  .displayContainer {
    display: grid;
    grid-template-rows: 1;
    overflow: scroll;
  }

  .displayItem {
    grid-row: 1;
  }

</style>

<div class:pageContainer>
  <div class:imageRow>
    <div class:imageColumn>
      <DrawableImage {width} bind:height {size} {color} bind:path />
      <div class:buttonRow><button>Add</button> <button>Reset</button></div>
    </div>
    <div class:instructionsColumn>
      <p><strong>Instructions:</strong></p>
      <p>Help the network guess what animal this is!</p>
      <p>Add {$outputSize} contours to send to the hidden layers.</p>
      <p>Click and drag on the image to draw a contour.</p>
      <p>Every contour has a limited number of pixels.</p>
    </div>
  </div>
  <div class:displayContainer>
    {#each displayCanvases as _, index}
      <div class:displayItem>
        <DisplayCanvas
          bind:this={displayCanvases[index]}
          {width}
          {height}
          {color}
          {path} />
      </div>
    {/each}
  </div>
</div>
