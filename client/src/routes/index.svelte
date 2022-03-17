<script lang="ts">
	import { onMount } from "svelte";
	import { socket, waitForSocket } from "$lib/stores/socketStore";
	import ChooseRole, { ERole } from "$lib/components/entry/ChooseRole.svelte";
	import Student from "$lib/components/entry/Student.svelte";
	import Teacher from "$lib/components/entry/Teacher.svelte";

	onMount(() => {
		socket;
	});

	let role: ERole;
</script>

{#await waitForSocket() then _}
	<h1>
		{#if !role}
			<ChooseRole bind:role />
		{:else if role === ERole.Teacher}
			<Teacher />
		{:else if role === ERole.Student}
			<Student />
		{/if}
	</h1>
{/await}
