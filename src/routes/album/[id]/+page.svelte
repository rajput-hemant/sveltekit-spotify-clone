<script lang="ts">
	import ItemPage from '$components/ItemPage.svelte';
	import TrackList from '$components/TrackList.svelte';
	import { getCopyrightSymbol } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	$: album = data.album;
	$: color = data.color;
</script>

<ItemPage
	title={album.name}
	type={album.album_type}
	{color}
	image={album.images.length > 0 ? album.images[0].url : undefined}
>
	<!-- meta -->
	<p slot="meta" class="space-x-1.5 text-xs font-semibold">
		<!-- artists -->
		<span>{album.artists.map((artist) => artist.name).join(', ')}</span>

		<!-- date -->
		<span>{new Date(album.release_date).getFullYear()}</span>

		<!-- tracks count -->
		<span class="font-normal text-light-gray"
			>{`${album.total_tracks} Track${album.total_tracks > 1 ? 's' : ''}`}</span
		>
	</p>

	<!-- tracks -->
	<TrackList tracks={album.tracks.items} />

	<!-- credits -->
	<div class="mt-5">
		<!-- date -->
		<p class="text-sm text-light-gray">
			{new Date(album.release_date).toLocaleDateString('en', {
				dateStyle: 'medium'
			})}
		</p>

		{#each album.copyrights as copyright}
			<!--copyright  -->
			<p class="text-xs text-light-gray">{getCopyrightSymbol(copyright.type)} {copyright.text}</p>
		{/each}
	</div>
</ItemPage>
