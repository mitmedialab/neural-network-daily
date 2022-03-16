<script lang="ts">
  import { page } from "$app/stores";
  import JoinRoom from "$lib/components/JoinRoom.svelte";
  const { id } = $page.params;
</script>

<style>
</style>

<JoinRoom {id} />
