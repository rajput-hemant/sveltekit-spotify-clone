<script lang="ts">
	import { Music } from 'lucide-svelte';
	import Skeleton from './Skeleton.svelte';

	type AlbumType = SpotifyApi.AlbumObjectFull | SpotifyApi.AlbumObjectSimplified;
	type PlaylistType = SpotifyApi.PlaylistObjectFull | SpotifyApi.PlaylistObjectSimplified;
	type ArtistType = SpotifyApi.ArtistObjectFull;

	export let item: AlbumType | PlaylistType | ArtistType;
</script>

<!-- card -->
<div
	class="group relative h-full rounded border border-medium-gray bg-dark-gray p-2 transition-[background] duration-300 hover:bg-medium-gray"
>
	{#if item.images.length > 0}
		<div class="relative mb-5 aspect-square w-full overflow-hidden rounded">
			<img
				src={item.images[0].url}
				alt="{item.type} cover for {item.name}"
				loading="lazy"
				class="object-cover transition-transform duration-300 group-hover:scale-105"
			/>

			<Skeleton className="absolute inset-0" />
		</div>
	{:else}
		<!-- cover placeholder -->
		<div
			class="mb-5 flex aspect-square w-full items-center justify-center bg-medium-gray transition-[background] duration-300 hover:bg-dark-gray"
		>
			<Music aria-hidden={true} focusable="false" class="h-2/5 w-2/5 text-light-gray" />
		</div>
	{/if}

	<h4 class="truncate text-base font-semibold">
		<a
			href="/{item.type}/{item.id}"
			class="text-text after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:after:rounded focus-visible:after:ring-2 focus-visible:after:ring-accent focus-visible:after:ring-offset-2 focus-visible:after:ring-offset-inherit"
			>{item.name}</a
		>
	</h4>

	<p class="relative line-clamp-2 text-sm text-light-gray">
		{#if item.type === 'album'}
			{item.artists.map((artist) => artist.name).join(', ')}
		{/if}

		{#if item.type === 'playlist'}
			{item.description}
		{/if}
	</p>
</div>
