<script lang="ts" context="module">
  export enum ERole {
    Undecided,
    Teacher,
    Student,
  }
</script>

<script lang="ts">
  export let role: ERole;
</script>

Are you a
<button on:click={() => (role = ERole.Teacher)}>Teacher</button>
or a
<button on:click={() => (role = ERole.Student)}>Student</button>
