<script lang="ts">
  import { graphFactory } from "$lib/stores/graphStore";
  import type EParticipantRole from "$lib/shared/enums/EParticipantRole";
  import type {
    TConnectionInfo,
    TLayerInfo,
    TParticipantInfo,
  } from "$lib/shared/graph/C2CNode";
  import type C2CNode from "$lib/shared/graph/C2CNode";
  import type {
    TGraphConfig,
    TGraphParticipant,
    TLayerConfig,
  } from "$lib/shared/graph/graphConfigs";
  import { getConnectionStyle } from "$lib/utils";
  import { afterUpdate } from "svelte";

  export let capacity: number;
  export let self: TGraphParticipant;
  export let others: TGraphParticipant[];

  const column = true;
  const node = true;
  const output = true;

  let graphConfig: TGraphConfig = undefined;
  $: graphConfig = $graphFactory.getConfig(capacity);

  let layerMap: Map<EParticipantRole, TLayerConfig> = undefined;
  $: layerMap = $graphFactory.getLayerConfigMap(graphConfig);

  let graph: Map<EParticipantRole, C2CNode<any, any>[]> = undefined;
  $: graph = $graphFactory.buildGraph(graphConfig);

  let elements: { [k in EParticipantRole]?: HTMLDivElement[] };
  $: elements = [...layerMap].reduce((obj, [type, layerConfig]) => {
    const update = { ...obj };
    update[type] = Array<HTMLDivElement>(layerConfig.nodeCount);
    return update;
  }, {});

  const getColumnCss = (column: number) => `grid-column: ${column}`;

  const styleForConnection = (
    input: TConnectionInfo,
    destinationLayer: EParticipantRole,
    layerIndex: number
  ): string => {
    const origin = elements[input.layer][input.indexWithinLayer];
    const destination = elements[destinationLayer][layerIndex];
    return getConnectionStyle(origin, destination, "green", 10);
  };

  let connectionStyles: string[];
  afterUpdate(() => {
    connectionStyles = [];
    [...layerMap].forEach(([layerType, layerConfig]) => {
      for (let nodeIndex = 0; nodeIndex < layerConfig.nodeCount; nodeIndex++) {
        const node: C2CNode<any, any> = graph.get(layerType)[nodeIndex];
        node.connectedInputInfo?.forEach((input) => {
          const style = styleForConnection(input, layerType, nodeIndex);
          connectionStyles.push(style);
        });
      }
    });
  });
</script>

<style>
  .column {
    display: inline-block;
    margin: auto;
    vertical-align: middle;
  }
  .node {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: black;
    z-index: 10;
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
  {#each [...layerMap] as [layerType, layerConfig], layerIndex}
    <div class:column>
      {#each Array(layerConfig.nodeCount) as _, nodeIndex}
        <div
          class:node
          class:pad={nodeIndex > 0}
          style={getColumnCss(layerIndex)}
          bind:this={elements[layerType][nodeIndex]} />
      {/each}
    </div>
    <div class:column>
      <div style="width: 100px" />
    </div>
  {/each}
  <div class:column class:output style={getColumnCss(graphConfig.depth)} />
</div>

{#if connectionStyles}
  {#each connectionStyles as style}
    <div {style} />
  {/each}
{/if}
