<script lang="ts">
	import { cn, getDuration } from '$lib/utils';
	import { Clock8, ListPlus } from 'lucide-svelte';
	import Player from './Player.svelte';

	export let tracks: (SpotifyApi.TrackObjectFull | SpotifyApi.TrackObjectSimplified)[];

	let currentlyPlaying: string | null = null;
	let isPaused = false;
</script>

<!-- row header -->
<div class="mb-4 flex items-center rounded border-b border-white/10 p-5">
	<!-- number column -->
	<div class="w-8">
		<span class="text-sm text-light-gray">#</span>
	</div>

	<!-- info column -->
	<div class="flex-1">
		<!-- track title -->
		<span class="text-xs uppercase text-light-gray">Title</span>
	</div>

	<!-- duration column -->
	<div class="mr-8">
		<Clock8 aria-hidden={true} focusable="false" class="h-4 w-4 text-light-gray" />
	</div>
</div>

{#each tracks as track, index}
	<!-- row -->
	<div class="group flex items-center rounded px-1 py-2 hover:bg-white/5">
		<!-- number column -->
		<div class="flex w-8 items-center justify-center">
			{#if currentlyPlaying === track.id && !isPaused}
				<img src="/assets/playing.gif" alt="" class="w-3 group-hover:hidden" />
			{:else}
				<span class="text-light-gray group-hover:hidden">{index + 1}</span>
			{/if}

			<Player
				{track}
				on:play={(e) => {
					currentlyPlaying = e.detail.track.id;
					isPaused = false;
				}}
				on:pause={(e) => {
					isPaused = e.detail.track.id === currentlyPlaying;
				}}
				className="group-hover:block hidden"
			/>
		</div>

		<!-- info column -->
		<div class="flex-1">
			<!-- track title -->
			<div class="flex items-center">
				<h4 class={cn('text-xl font-semibold', track.id === currentlyPlaying && 'text-accent')}>
					{track.name}
				</h4>

				{#if track.explicit}
					<span
						class="ml-2 rounded border border-white/10 px-2 py-0.5 text-[8px] uppercase text-light-gray"
						>Explicit</span
					>
				{/if}
			</div>

			<!-- artists -->
			<p class="m-0 mt-2 text-sm text-light-gray">
				{#each track.artists as artist, artistsIndex}
					<a href="/artist/{artist.id}" class="text-inherit hover:brightness-110">{artist.name}</a
					>{#if artistsIndex < track.artists.length - 1}{', '}{/if}
				{/each}
			</p>
		</div>

		<!-- duration column -->
		<div>
			<!-- duration -->
			<span class="text-sm text-light-gray">{getDuration(track.duration_ms)}</span>
		</div>

		<!-- actions column -->
		<div class="ml-4 w-8">
			<ListPlus aria-hidden={true} focusable="false" />
		</div>
	</div>
{/each}
