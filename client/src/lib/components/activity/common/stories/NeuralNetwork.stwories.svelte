<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import NeuralNetwork from "$lib/components/activity/common/NeuralNetwork.svelte";

</script>

<Meta
  title="components/activity/common/NeuralNetwork"
  component={NeuralNetwork}
  argTypes={{}} />

<Template let:args>
  <NeuralNetwork {...args} />
</Template>
