<script lang="ts">
  import { range } from "$lib/shared/common/utils";
  import { goto } from "$app/navigation";
  import { socket } from "$lib/stores/socketStore";
  import { role, capacity as capacityStore } from "$lib/stores/activityStore";
  import EParticipantRole from "$lib/shared/enums/EParticipantRole";

  let capacity: number;

  const allowedCapacities: number[] = Array.from(range(6, 7));

  const onStartRoom = (room: string) => {
    role.set(EParticipantRole.Facilitator);
    capacityStore.set(capacity);
    goto(room);
  };

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
