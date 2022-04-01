<script lang="ts">
  import { capacity as capacityStore } from "$lib/stores/activityStore";
  import { valueOf } from "$lib/stores/storeUtility";
  import NeuralNetwork from "../common/NeuralNetwork.svelte";
  import ShareableLink from "./ShareableLink.svelte";

  let capacity: number = valueOf(capacityStore);

</script>

<ShareableLink />
<NeuralNetwork {capacity} />
