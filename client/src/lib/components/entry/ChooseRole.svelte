<script lang="ts" context="module">
  export const enum EChoice {
    Undecided,
    Teacher,
    Student,
  }
</script>

<script lang="ts">
  export let choice: EChoice;
</script>

Are you a
<button on:click={() => (choice = EChoice.Teacher)}>Teacher</button>
or a
<button on:click={() => (choice = EChoice.Student)}>Student</button>
