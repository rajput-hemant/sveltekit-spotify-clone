<script lang="ts">
	import Button from '$components/Button.svelte';
	import Card from '$components/Card.svelte';
	import ItemPage from '$components/ItemPage.svelte';
	import TrackList from '$components/TrackList.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: color = data.color;
	$: artist = data.artist;
	$: topTracks = data.artistTopTracks;
	$: albums = data.artistAlbums;
	$: relatedArtists = data.artistRelatedArtists;
	$: appearsOn = data.artistAppearsOn;

	const formatFollowers = Intl.NumberFormat('en-US', { notation: 'compact' }).format;
</script>

<ItemPage
	title={artist.name}
	image={artist.images.length ? artist.images[0].url : undefined}
	{color}
	type={artist.type}
>
	<p class="meta" slot="meta">
		{formatFollowers(artist.followers.total)} Followers
	</p>

	<div class="content">
		{#if topTracks && topTracks.tracks.length > 0}
			<div class="mt-10">
				<div class="items-title center mt-2 flex justify-between">
					<h2 class="text-2xl font-semibold">Top Tracks</h2>
				</div>

				<TrackList
					tracks={topTracks.tracks}
					userPlaylists={data.userAllPlaylists?.filter((pl) => pl.owner.id === data.user?.id)}
				/>
			</div>
		{/if}

		{#if albums && albums.items.length > 0}
			<div class="mt-10">
				<div class="mb-3 flex items-center justify-between">
					<h2 class="text-2xl font-semibold">Albums</h2>

					<Button element="a" href={`/artist/${artist.id}/albums`} variant="outline">
						View All <span class="sr-only">Albums</span>
					</Button>
				</div>

				<div class="grid-items">
					{#each albums.items as album}
						<div class="grid-item">
							<Card item={album} />
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if appearsOn && appearsOn.items.length > 0}
			<div class="mt-10">
				<div class="mb-3 flex items-center justify-between">
					<h2 class="text-2xl font-semibold">Appears On</h2>

					<Button element="a" href={`/artist/${artist.id}/appears-on`} variant="outline">
						View All <span class="sr-only">artist appearances</span>
					</Button>
				</div>

				<div class="grid-items">
					{#each appearsOn.items as album}
						<div class="grid-item">
							<Card item={album} />
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if relatedArtists && relatedArtists.artists.length > 0}
			<div class="mt-10">
				<div class="mb-3 flex w-full items-center justify-between">
					<h2 class="text-2xl font-semibold">Related Artists</h2>

					<Button element="a" href={`/artist/${artist.id}/related-artists`} variant="outline">
						View All <span class="sr-only">Related Artists</span>
					</Button>
				</div>

				<div class="grid-items">
					{#each relatedArtists.artists.splice(0, 6) as artists}
						<div class="grid-item">
							<Card item={artists} />
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</ItemPage>
