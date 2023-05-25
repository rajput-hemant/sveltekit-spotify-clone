<script lang="ts">
	import '@fontsource/metropolis/400.css';
	import '@fontsource/metropolis/500.css';
	import '@fontsource/metropolis/600.css';
	import '@fontsource/metropolis/700.css';

	import '../app.css';

	import type { LayoutData } from './$types';
	import Logout from '$components/logout.svelte';

	export let data: LayoutData;

	$: user = data.user;
</script>

<div class="grid place-items-center h-screen">
	{#if user}
		<div class="flex items-center flex-col text-2xl">
			<p>
				User: <span class="text-accent">{data.user?.display_name} </span>
			</p>

			<Logout />
		</div>
	{/if}

	<slot />
</div>
