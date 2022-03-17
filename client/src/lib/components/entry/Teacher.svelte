<script lang="ts">
  import { range } from "$lib/shared/common/utils";
  import { goto } from "$app/navigation";
  import { socket } from "$lib/stores/socketStore";

  let capacity: number;

  const allowedCapacities: number[] = Array.from(range(6, 7));

  const onStartRoom = (room: string) => {
    goto(room);
  };

  //getStudentUrl = () => `${window.location}${roomID}`;
</script>

<label for="capacity">Capacity:</label>
<select id="capacity" bind:value={capacity}>
  {#each allowedCapacities as capacity}
    <option value={capacity}>{capacity}</option>
  {/each}
</select>

<button on:click={() => $socket.send('startRoom', [capacity, onStartRoom])}>
  Start Room
</button>
