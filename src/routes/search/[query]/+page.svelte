<script lang="ts">
	import Card from '$components/Card.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: albums = data.searchResults.albums?.items;
	$: playlists = data.searchResults.playlists?.items;
	$: artists = data.searchResults.artists?.items;
</script>

<h1 class="text-3xl">{data.title}</h1>

{#if (!albums || albums.length === 0) && (!playlists || playlists.length === 0) && (!artists || artists.length === 0)}
	<p>No results found!</p>
{/if}

{#if albums && albums.length > 0}
	<section class="mb-10">
		<h2 class="text-2xl">Albums</h2>

		<div class="grid-items">
			{#each albums as album}
				<div class="grid-item">
					<Card item={album} />
				</div>
			{/each}
		</div>
	</section>
{/if}

{#if playlists && playlists.length > 0}
	<section class="mb-10">
		<h2 class="text-2xl">Playlists</h2>

		<div class="grid-items">
			{#each playlists as playlist}
				<div class="grid-item">
					<Card item={playlist} />
				</div>
			{/each}
		</div>
	</section>
{/if}

{#if artists && artists.length > 0}
	<section class="mb-10">
		<h2 class="text-2xl">Artists</h2>

		<div class="grid-items">
			{#each artists as artist}
				<div class="grid-item">
					<Card item={artist} />
				</div>
			{/each}
		</div>
	</section>
{/if}
