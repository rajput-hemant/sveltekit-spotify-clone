<script context="module" lang="ts">
	let current: HTMLAudioElement;
</script>

<script lang="ts">
	import { Pause, Play } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	type Track = SpotifyApi.TrackObjectFull | SpotifyApi.TrackObjectSimplified;

	const dispatch = createEventDispatcher<{
		play: { track: Track };
		pause: { track: Track };
	}>();

	export let track: Track;
	export let className = '';

	let audio: HTMLAudioElement;
	let paused = true;

	function handlePlay() {
		if (current && current !== audio) {
			current.currentTime = 0;
			current.pause();
		}

		current = audio;
		dispatch('play', { track });
	}

	function handlePause() {
		paused = true;
		dispatch('pause', { track });
	}
</script>

<!-- player -->
<div class="player {className}">
	<audio
		src={track.preview_url}
		controls
		bind:this={audio}
		bind:paused
		on:play={handlePlay}
		on:pause={handlePause}
		preload="none"
		class="hidden"
	/>

	<button
		on:click={() => (paused ? audio.play() : audio.pause())}
		aria-label={paused ? 'Play' : 'Pause' + ` ${track.name}`}
		class="cursor-pointer"
	>
		{#if paused}
			<Play class="fill-light-gray text-light-gray" aria-hidden={true} focusable="false" />
		{:else}
			<Pause class="fill-light-gray text-light-gray" aria-hidden={true} focusable="false" />
		{/if}
	</button>
</div>

<!-- styles for when js is disabled  -->
<style lang="postcss">
	:global(html.no-js) audio {
		@apply block w-36 sm:w-56;
	}
	:global(html.no-js) button {
		@apply hidden;
	}

	:global(html.no-js) .player {
		@apply block;
	}
</style>
