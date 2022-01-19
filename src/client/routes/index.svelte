<script lang="ts">
	import StartRoom from "$lib/sockets/StartRoom.svelte";
	import { room } from "$lib/activity_store";

</script>

<h1>Welcome to SvelteKit get you you</h1>
<p>
	Visit
	<a href="https://kit.svelte.dev">kit.svelte.dev</a>
	to read the documentation
</p>
<StartRoom />
