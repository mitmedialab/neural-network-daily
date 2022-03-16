<script lang="ts">
	import Student from "$lib/components/Student.svelte";
	import Teacher from "$lib/components/Teacher.svelte";
	import { socket, waitForSocket } from "$lib/store";
	import { onMount } from "svelte";

	enum ERole {
		Teacher,
		Student,
		Undecided,
	}

	let role: ERole = ERole.Undecided;

	onMount(() => {
		socket;
	});
</script>

{#await waitForSocket() then _}
	<h1>
		{#if role === ERole.Undecided}
			Are you a
			<button on:click={() => (role = ERole.Teacher)}>Teacher</button>
			or a
			<button on:click={() => (role = ERole.Student)}>Student</button>
		{:else if role === ERole.Teacher}
			<Teacher />
		{:else if role === ERole.Student}
			<Student />
		{/if}
	</h1>
{/await}
