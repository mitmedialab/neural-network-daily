<script lang="ts">
  import { room } from "$lib/stores/activityStore";

  import { onMount } from "svelte";

  let studentLink: string;
  onMount(() => {
    studentLink = `${window.location.origin}/student/${$room}`;
  });

</script>

<h2>
  Tell your students to navigate to:
  <a href={studentLink}>{studentLink}</a>
</h2>
