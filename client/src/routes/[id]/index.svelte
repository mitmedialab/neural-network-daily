<script lang="ts">
  import { page } from "$app/stores";
  import StudentView from "$lib/components/activity/student/StudentView.svelte";
  import TeacherView from "$lib/components/activity/teacher/TeacherView.svelte";
  import EParticipantRole from "$lib/shared/enums/EParticipantRole";
  import { role, room } from "$lib/stores/activityStore";
  const { id } = $page.params;
  room.set(id);

</script>

<style>
</style>

{#if $role === EParticipantRole.Facilitator}
  <TeacherView />
{:else}
  <StudentView />
{/if}
