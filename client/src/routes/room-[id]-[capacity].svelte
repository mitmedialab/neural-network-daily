<script lang="ts">
  import { page } from "$app/stores";
  import { graphFactory, room } from "$lib/activityStore";
  import type EParticipantRole from "$lib/shared/enums/EParticipantRole";
  import type C2CNode from "$lib/shared/graph/C2CNode";
  import type {
    TGraphConfig,
    TLayerConfig,
  } from "$lib/shared/graph/graphConfigs";
  import { onMount } from "svelte";

  const column = true;
  const layer = true;
  const node = true;
  const connection = true;
  const connections = true;
  const output = true;

  const capacity = $page.params.capacity;
  let graphConfig: TGraphConfig;
  $: graphConfig = $graphFactory.getConfig(parseInt(capacity));

  let layerMap: Map<EParticipantRole, TLayerConfig>;
  $: layerMap = $graphFactory.getLayerConfigMap(graphConfig);

  let graph: Map<EParticipantRole, C2CNode<number, number>[]>;
  $: graph = $graphFactory.buildGraph<number, number, number, number>(
    graphConfig
  );

  let elements: { [k in EParticipantRole]?: HTMLDivElement[] };
  $: elements = [...layerMap].reduce((obj, [type, layerConfig]) => {
    const updated = { ...obj };
    updated[type] = Array<HTMLDivElement>(layerConfig.nodeCount);
    return updated;
  }, {});

  const getColumnCss = (column: number) => `grid-column: ${column}`;

  onMount(() => {
    console.log(elements);
  });
</script>

<style>
  .column {
    display: inline-block;
    margin: auto;
    vertical-align: middle;
  }
  .connections {
  }

  .connection {
    width: 100px;
    height: 100px;
  }
  .node {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: black;
  }
  .output {
    width: 100px;
    height: 100px;
    background-color: black;
  }
  .pad {
    margin-top: 50px;
  }
</style>

<div>
  {#each [...layerMap] as [type, layerConfig], layerIndex}
    <div class:column>
      {#each Array(layerConfig.nodeCount) as _, nodeIndex}
        <div
          class:node
          class:pad={nodeIndex > 0}
          style={getColumnCss(layerIndex)}
          bind:this={elements[type][nodeIndex]} />
      {/each}
    </div>
    <div class:column class:connections>
      <div class:connection />
    </div>
  {/each}
  <div class:column class:output style={getColumnCss(graphConfig.depth)} />
</div>
