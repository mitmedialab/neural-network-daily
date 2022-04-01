<script>
  import { page } from "$app/stores";
  import StudentLanding from "$lib/components/landing/StudentLanding.svelte";

</script>

<StudentLanding id={$page.params.id} />
