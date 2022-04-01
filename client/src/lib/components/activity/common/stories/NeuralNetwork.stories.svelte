<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import NeuralNetwork from "$lib/components/activity/common/NeuralNetwork.svelte";

</script>

<Meta
  title="components/activity/common/NeuralNetwork"
  component={NeuralNetwork}
  argTypes={{
    capacity: {
      defaultValue: 6,
      control: { type: 'range', min: 6, max: 12, step: 1 },
    },
  }} />

<Template let:args>
  <NeuralNetwork {...args} />
</Template>

<Story name="Default" />
