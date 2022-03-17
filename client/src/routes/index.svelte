<script lang="ts">
	import { onMount } from "svelte";
	import { socket, waitForSocket } from "$lib/stores/socketStore";
	import ChooseRole, { EChoice } from "$lib/components/entry/ChooseRole.svelte";
	import Student from "$lib/components/entry/Student.svelte";
	import Teacher from "$lib/components/entry/Teacher.svelte";

	onMount(() => {
		socket;
	});

	let choice: EChoice;
</script>

{#await waitForSocket() then _}
	<h1>
		{#if !choice}
			<ChooseRole bind:choice />
		{:else if choice === EChoice.Teacher}
			<Teacher />
		{:else if choice === EChoice.Student}
			<Student />
		{/if}
	</h1>
{/await}
