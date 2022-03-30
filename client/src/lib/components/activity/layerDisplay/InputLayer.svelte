<script lang="ts" context="module">
  function getDistance(from: TCoordinate, to: TCoordinate): number {
    return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
  }

</script>

<script lang="ts">
  import { lime } from "$lib/colors";
  import type { TColor } from "$lib/colors";

  import { outputSize } from "$lib/stores/activityStore";
  import DisplayCanvas from "$lib/components/activity/layerDisplay/canvases/DisplayCanvas.svelte";
  import DrawableImage, {
    TPathUpdated,
  } from "$lib/components/activity/layerDisplay/canvases/DrawableImage.svelte";
  import type { TCoordinate } from "$lib/shared/contours/TContour";

  const pageContainer = true;
  const title = true;
  const displayContainer = true;
  const displayItem = true;
  const imageRow = true;
  const buttonRow = true;
  const imageColumn = true;
  const instructionsColumn = true;

  const width: number = 300;
  const size: number = 4;
  const color: TColor = lime;
  const displayColor: TColor = { red: 112, green: 112, blue: 112 };
  let height: number;

  const displayCanvases: DisplayCanvas[] = Array<DisplayCanvas>($outputSize);
  const canvasesSet: boolean[] = Array<boolean>($outputSize);
  let paths: TCoordinate[][] = Array<TCoordinate[]>($outputSize);
  let drawable: DrawableImage;
  let drawingEnabled: boolean = true;
  let activeDisplayIndex: number = 0;

  const distanceLimit: number = 80;
  let contourDistance: number = 0;

  let readyToSend: boolean = false;
  $: readyToSend = activeDisplayIndex < 0 || activeDisplayIndex >= $outputSize;
  $: drawingEnabled = readyToSend ? false : drawingEnabled;

  const handlePathUpdate = (e: CustomEvent<TPathUpdated["pathUpdate"]>) => {
    displayCanvases[activeDisplayIndex].draw(e.detail);
    const { length } = e.detail;
    contourDistance += getDistance(e.detail[length - 1], e.detail[length - 2]);
    drawingEnabled = Math.ceil(contourDistance) < distanceLimit;
  };

  const handleMouseUp = () => {
    if (contourDistance > 0) {
      drawingEnabled = false;
    }
  };

  const handleAdd = () => {
    paths[activeDisplayIndex] = [...drawable.path];
    paths = [...paths];
    canvasesSet[activeDisplayIndex] = true;
    drawable.clearPath();
    const isNotSet = (value: boolean) => !value;
    activeDisplayIndex = canvasesSet.findIndex(isNotSet);
    contourDistance = 0;
    drawingEnabled = true;
  };

  const handleReset = () => {
    drawable.clearPath();
    displayCanvases[activeDisplayIndex].clear();
    contourDistance = 0;
    drawingEnabled = true;
  };

  const handleSend = () => {};

</script>

<style>
  .pageContainer {
    height: 100vh;
    width: 100vw;
    background-color: rgb(246, 204, 130);
    font-family: sans-serif;
  }

  .title {
    margin: 0px auto;
    width: fit-content;
    padding: 20px;
    font-size: 2rem;
    color: white;
  }

  .imageRow {
    margin: 0px auto;
    width: fit-content;
  }

  .imageRow > * {
    vertical-align: top;
    display: inline-block;
  }
  .imageColumn {
    padding-right: 20px;
  }

  .instructionsColumn {
    color: rgb(80, 80, 80);
  }

  .buttonRow {
    margin: 10px auto;
    width: fit-content;
  }

  .buttonRow > button {
    border-radius: 5px;
    border: 1px solid grey;
  }

  .displayContainer {
    display: grid;
    grid-template-rows: 1;
    overflow: scroll;
    width: fit-content;
    margin: 10px auto;
  }

  .displayItem {
    grid-row: 1;
    border-radius: 50%;
    margin-right: 20px;
  }

</style>

<div class:pageContainer>
  <div class:title>
    <p>It's your turn!</p>
  </div>
  <div class:imageRow>
    <div class:imageColumn>
      <DrawableImage
        bind:this={drawable}
        {width}
        bind:height
        {size}
        {color}
        displayPaths={paths}
        {displayColor}
        enabled={drawingEnabled}
        on:mouseup={handleMouseUp}
        on:pathUpdate={handlePathUpdate} />
      <div class:buttonRow>
        <button
          disabled={readyToSend || contourDistance === 0}
          on:click={handleAdd}>Add</button>
        <button
          disabled={readyToSend || contourDistance === 0}
          on:click={handleReset}>Reset</button>
        <button disabled={!readyToSend} on:click={handleSend}>Send</button>
        <br />
        <p>
          Remaining Distance:
          {Math.max(0, distanceLimit - Math.ceil(contourDistance))}
        </p>
      </div>
    </div>
    <div class:instructionsColumn>
      <p><strong>Instructions:</strong></p>
      <p>Help the network guess what animal this is!</p>
      <p>Add {$outputSize} contours to send to the hidden layers.</p>
      <p>Click and drag on the image to draw a contour.</p>
      <p>
        The contour will end when you either lift your finger,
        <br />or reach the distance limit.
      </p>
    </div>
  </div>
  <div class:displayContainer>
    {#each displayCanvases as _, index}
      <div class:displayItem>
        <DisplayCanvas
          bind:this={displayCanvases[index]}
          {size}
          {width}
          {height}
          color={displayColor} />
      </div>
    {/each}
  </div>
</div>
