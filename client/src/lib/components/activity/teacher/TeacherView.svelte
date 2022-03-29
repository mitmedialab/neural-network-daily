<script lang="ts">
  import { capacity as capacityStore } from "$lib/stores/activityStore";
  import { valueOf } from "$lib/stores/storeUtility";
  import NeuralNetwork from "../common/NeuralNetwork.svelte";

  let capacity: number = valueOf(capacityStore);

</script>

Teacher
<NeuralNetwork {capacity} />
