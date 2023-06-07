<script lang="ts">
	import { Music } from 'lucide-svelte';
	import Skeleton from './Skeleton.svelte';
	import { cn } from '$lib/utils';

	type AlbumType = SpotifyApi.AlbumObjectFull | SpotifyApi.AlbumObjectSimplified;
	type PlaylistType = SpotifyApi.PlaylistObjectFull | SpotifyApi.PlaylistObjectSimplified;
	type ArtistType = SpotifyApi.ArtistObjectFull;

	export let item: AlbumType | PlaylistType | ArtistType;

	const formatFollowers = Intl.NumberFormat('en-US', { notation: 'compact' }).format;
</script>

<!-- card -->
<div
	class={cn(
		'group relative h-full rounded border border-medium-gray bg-dark-gray p-2 transition-[background] duration-300 hover:bg-medium-gray',
		item.type === 'artist' && 'px-5 py-8 text-center'
	)}
>
	{#if item.images.length > 0}
		<div
			class={cn(
				'relative mb-5 aspect-square w-full overflow-hidden rounded',
				item.type === 'artist' && 'rounded-full shadow-md shadow-black'
			)}
		>
			<img
				src={item.images[0].url}
				alt="{item.type} cover for {item.name}"
				loading="lazy"
				class="object-cover transition-transform duration-300 group-hover:scale-105"
			/>

			<Skeleton className="absolute inset-0 -z-10" />
		</div>
	{:else}
		<!-- cover placeholder -->
		<div
			class={cn(
				'mb-5 flex aspect-square w-full items-center justify-center bg-medium-gray transition-[background] duration-300 group-hover:bg-dark-gray',
				item.type === 'artist' && 'rounded-full shadow-md shadow-black'
			)}
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

		{#if item.type === 'artist'}
			<p class="truncate">{formatFollowers(item.followers.total)} Followers</p>
		{/if}
	</p>
</div>
