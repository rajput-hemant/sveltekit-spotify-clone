<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import Logout from '$components/Logout.svelte';

	let isRetring = false;
	const retryRoutes = [
		'/album/[id]',
		'/playlist/[id]',
		'/artist/[id]',
		'/search/[query]',
		'/[list=list]/[...rest]'
	];

	const retryHandler = async () => {
		isRetring = true;
		await invalidate(`app:${$page.route.id}`);
		isRetring = false;
	};
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<!-- content -->
<div class="text-center">
	<h1 class="text-4xl font-bold">{$page.error?.message}</h1>

	{#if $page.status === 404}
		<p class="text-2xl">The page you are trying to access cannot be found.</p>
	{/if}

	{#if $page.status === 401}
		<p class="text-2xl">Your current session has expired, please logout and login again.</p>
		<Logout />
	{/if}

	<!-- buttons -->
	<div class="mt-10 space-x-4">
		{#if $page.status === 404}
			<Button element="a" href="/">Home</Button>
			<Button element="a" href="/search">Search</Button>
		{/if}

		{#if ![404, 401].includes($page.status) && $page.route.id && retryRoutes.includes($page.route.id)}
			<Button element="button" disabled={isRetring} on:click={retryHandler}>Retry</Button>
		{/if}
	</div>
</div>
