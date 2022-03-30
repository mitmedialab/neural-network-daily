<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import DrawableImage from "$lib/components/activity/layerDisplay/canvases/DrawableImage.svelte";

</script>

<Meta
  title="components/activity/layerDisplay/canvases/DrawableImage"
  component={DrawableImage}
  argTypes={{}} />

<Template let:args>
  <DrawableImage {...args} />
</Template>

<Story name="Default" />
