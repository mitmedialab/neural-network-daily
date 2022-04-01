<script lang="ts">
  import { graphFactory } from "$lib/stores/graphStore";
  import type EParticipantRole from "$lib/shared/enums/EParticipantRole";
  import type { TConnectionInfo } from "$lib/shared/graph/C2CNode";
  import type C2CNode from "$lib/shared/graph/C2CNode";
  import type {
    TGraphConfig,
    TGraphParticipant,
    TLayerConfig,
  } from "$lib/shared/graph/graphConfigs";
  import { getConnectionStyle } from "$lib/utils";
  import { nameMap } from "$lib/stores/activityStore";
  import { getColorCssForLayer } from "$lib/colors";
  import { waitForCondition } from "$lib/shared/common/utils";

  export let capacity: number;
  export let self: TGraphParticipant;
  export let others: TGraphParticipant[];

  const column = true;
  const node = true;
  const output = true;
  const gap = true;
  const nodeName = true;

  const unfilledName = "waiting...";

  const graphConfig: TGraphConfig = $graphFactory.getConfig(capacity);
  const layerMap: Map<EParticipantRole, TLayerConfig> =
    $graphFactory.getLayerConfigMap(graphConfig);
  const graph: Map<EParticipantRole, C2CNode<any, any>[]> =
    $graphFactory.buildGraph(graphConfig);

  const elements: { [k in EParticipantRole]?: HTMLDivElement[] } = [
    ...layerMap,
  ].reduce((obj, [type, layerConfig]) => {
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
    return getConnectionStyle(origin, destination, 1);
  };

  const getConnectionStyles = async () => {
    await waitForCondition(() => elements[0][0] !== undefined);
    const styles = [];
    [...layerMap].forEach(([layerType, layerConfig]) => {
      for (let nodeIndex = 0; nodeIndex < layerConfig.nodeCount; nodeIndex++) {
        const node: C2CNode<any, any> = graph.get(layerType)[nodeIndex];
        node.connectedInputInfo?.forEach((input) => {
          const style = styleForConnection(input, layerType, nodeIndex);
          styles.push(style);
        });
      }
    });
    return styles;
  };

  const isSelf = (layerType: EParticipantRole, nodeIndex: number) => {
    return self?.layer === layerType && self?.indexWithinLayer === nodeIndex;
  };

</script>

<style>
  .column {
    display: inline-block;
    margin: auto;
    vertical-align: middle;
    align-items: center;
    text-align: center;
  }
  .gap {
    width: 100px;
  }
  .node {
    width: 20px;
    height: 20px;
    margin: auto;
    border-radius: 50%;
    background-color: var(--color);
    z-index: 10;
  }
  .nodeName {
    z-index: 10;
    font-size: 1rem;
    border-radius: 1rem;
    margin-top: 0.25rem;
    padding: 0.1rem 0.25rem;
    background-color: rgba(255, 255, 255, 0.5);
    font-family: sans-serif;
  }
  .output {
    width: 100px;
    height: 100px;
    background-color: black;
  }
  .pad {
    margin-top: 20px;
  }

</style>

<div>
  {#each [...layerMap] as [layerType, layerConfig], layerIndex}
    <div class:column style={getColorCssForLayer(layerType, '--color')}>
      {#each Array(layerConfig.nodeCount) as _, nodeIndex}
        <div
          class:node
          class:pad={nodeIndex > 0}
          style={getColumnCss(layerIndex)}
          bind:this={elements[layerType][nodeIndex]} />
        <div class:nodeName>
          {#if isSelf(layerType, nodeIndex)}
            <strong>{self.participantName} (You!)</strong>
          {:else if $nameMap?.get(layerType)?.[nodeIndex]}
            {$nameMap.get(layerType)[nodeIndex]}
          {:else}<em>{unfilledName}</em>{/if}
        </div>
      {/each}
    </div>
    <div class:column>
      <div class:gap />
    </div>
  {/each}
  <div class:column class:output style={getColumnCss(graphConfig.depth)} />
</div>

{#await getConnectionStyles() then styles}
  {#each styles as style}
    <div {style} />
  {/each}
{/await}
