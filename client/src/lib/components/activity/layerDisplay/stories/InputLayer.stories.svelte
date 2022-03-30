<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import InputLayer from "$lib/components/activity/layerDisplay/InputLayer.svelte";
  import FunctionRunner from "$lib/components/storybook/FunctionRunner.svelte";
  import { outputSize } from "$lib/stores/activityStore";

</script>

<Meta
  title="components/activity/layerDisplay/InputLayer"
  component={InputLayer}
  argTypes={{}} />

<Story name="Default">
  <FunctionRunner
    mountFn={() => {
      outputSize.set(4);
    }}>
    <InputLayer />
  </FunctionRunner>
</Story>
