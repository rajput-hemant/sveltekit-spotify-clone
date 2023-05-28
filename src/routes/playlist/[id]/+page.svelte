<script lang="ts">
	import Button from '$components/Button.svelte';
	import ItemPage from '$components/ItemPage.svelte';
	import TrackList from '$components/TrackList.svelte';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;

	$: color = data.color;
	$: playlist = data.playlist;
	$: psuedoTracks = data.playlist.tracks;

	// pagination (shows up only when js is disabled)
	$: currentPage = $page.url.searchParams.get('page') || 1;

	let tracks: SpotifyApi.TrackObjectFull[];
	let isLoading = false;

	$: {
		tracks = [];
		psuedoTracks.items.forEach((item) => {
			if (item.track) {
				tracks = [...tracks, item.track];
			}
		});
	}

	const formattedFollowers = Intl.NumberFormat('en', { notation: 'compact' });

	const loadMore = async () => {
		if (!psuedoTracks.next) return;

		isLoading = true;
		const response = await fetch(
			psuedoTracks.next.replace('https://api.spotify.com/v1', '/api/spotify')
		);
		const data = await response.json();

		if (response.ok) {
			psuedoTracks = {
				...data,
				items: [...psuedoTracks.items, ...data.items]
			};
		} else {
			alert(data.error.message || 'Error loading more tracks');
		}

		isLoading = false;
	};
</script>

<ItemPage
	title={playlist.name}
	image={playlist.images.length > 0 ? playlist.images[0].url : undefined}
	{color}
	type={playlist.type}
>
	<div slot="meta" class="">
		<!-- playlist description -->
		<p class="text-lg text-light-gray">{@html playlist.description}</p>

		<!-- meta -->
		<p class="mt-5 space-x-1 text-sm">
			<span class="font-semibold">{playlist.owner.display_name}</span>

			<span>{formattedFollowers.format(playlist.followers.total)}</span>

			<span>{playlist.tracks.total} Tracks</span>
		</p>
	</div>

	{#if psuedoTracks.items.length > 0}
		<TrackList {tracks} />

		{#if psuedoTracks.next}
			<!-- load more -->
			<div class="load-more p-4 text-center">
				<Button element="button" variant="outline" disabled={isLoading} on:click={loadMore}>
					Load More
					<span class="sr-only">Tracks</span>
				</Button>
			</div>

			<!-- pagination (shows up only when js is disabled) -->
			<div class="pagination mt-10 hidden justify-between">
				<!-- previous -->
				{#if psuedoTracks.previous}
					<Button
						element="a"
						href="{$page.url.pathname}?page={Number(currentPage) - 1}"
						class="group flex gap-1 rounded-3xl border-2 border-accent px-3 py-2"
					>
						<ArrowLeft class="transition-transform duration-300 group-hover:-translate-x-1" />
						<span>Previous</span>
					</Button>
				{/if}

				<!-- next -->
				{#if psuedoTracks.next}
					<Button
						element="a"
						href="{$page.url.pathname}?page={Number(currentPage) + 1}"
						class="group ml-auto flex gap-1 rounded-3xl border-2 border-accent px-3 py-2"
					>
						<span>Next</span>
						<ArrowRight class="transition-transform duration-300 group-hover:translate-x-1" />
					</Button>
				{/if}
			</div>
		{/if}
	{:else}
		<!-- empty playlist -->
		<div class="mt-10 space-x-3 text-center">
			<p class="text-2xl font-semibold">No items added to this playlist yet!</p>

			<Button element="a" href="/search">Search for Content</Button>
			<Button element="a" href="/playlists">View all Playlist</Button>
		</div>
	{/if}
</ItemPage>

<!-- styles for when js is disabled  -->
<style lang="postcss">
	:global(html.no-js) .load-more {
		display: none;
	}
	:global(html.no-js) .pagination {
		display: flex;
	}
</style>
