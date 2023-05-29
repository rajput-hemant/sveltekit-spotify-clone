<script lang="ts">
	import Button from '$components/Button.svelte';
	import Card from '$components/Card.svelte';
	import { Plus } from 'lucide-svelte';
	import type { PageData } from './$types';
	import Pagination from '$components/Pagination.svelte';
	import { toasts } from '$stores';

	export let data: PageData;

	$: playlists = data.userPlaylists;

	let isLoading = false;

	const loadMoreItems = async () => {
		if (!playlists.next) return;

		isLoading = true;
		const response = await fetch(
			playlists.next.replace('https://api.spotify.com/v1', '/api/spotify')
		);
		const data = await response.json();

		if (response.ok) {
			playlists = {
				...data,
				items: [...playlists.items, ...data.items]
			};
		} else {
			toasts.error(data.error.message || 'Error loading more.');
		}

		isLoading = false;
	};
</script>

<!-- content -->
<div class="py-14">
	{#if playlists.items.length > 0}
		<!-- title -->
		<div class="flex items-center justify-between">
			<h1>{data.title}</h1>

			<Button element="button"><Plus class="h-5 w-5" /> Add New</Button>
		</div>

		<!-- grid items -->
		<div class="grid-items my-10">
			{#each playlists.items as item}
				<div class="">
					<Card {item} />
				</div>
			{/each}
		</div>

		<!-- pagination -->
		<Pagination list={playlists} on:loadmore={loadMoreItems} {isLoading} />
	{:else}
		<!-- empty playlist -->
		<div class="mt-10 space-x-3 text-center">
			<p class="text-2xl font-semibold">No Playlist yet!</p>

			<Button element="button"><Plus class="h-5 w-5" /> Add New</Button>
		</div>
	{/if}
</div>
