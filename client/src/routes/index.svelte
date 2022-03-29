<script lang="ts">
	import { onMount } from "svelte";
	import { socket, waitForSocket } from "$lib/stores/socketStore";
	import ChooseRole, {
		EChoice,
	} from "$lib/components/landing/ChooseRole.svelte";
	import StudentLanding from "$lib/components/landing/StudentLanding.svelte";
	import TeacherLanding from "$lib/components/landing/TeacherLanding.svelte";

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
			<TeacherLanding />
		{:else if choice === EChoice.Student}
			<StudentLanding />
		{/if}
	</h1>
{/await}
