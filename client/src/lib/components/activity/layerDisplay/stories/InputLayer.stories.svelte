<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import InputLayer from "$lib/components/activity/layerDisplay/InputLayer.svelte";
  import FunctionRunner from "$lib/components/storybook/FunctionRunner.svelte";
  import { outputSize } from "$lib/stores/activityStore";

</script>

<Meta
  title="components/activity/layerDisplay/InputLayer"
  component={InputLayer}
  argTypes={{
    outputSize: {
      type: 'number',
      control: { type: 'range', min: 2, max: 6, step: 1 },
    },
  }} />

<Story name="Default" let:args>
  <FunctionRunner
    mountFn={() => {
      outputSize.set(args.outputSize);
    }}>
    <InputLayer />
  </FunctionRunner>
</Story>
