<script lang="ts">
	import { cn, getDuration } from '$lib/utils';
	import { Clock8, ListPlus, ListX } from 'lucide-svelte';
	import Player from './Player.svelte';
	import tippy from '$actions/tippy/tippy-plugins';
	import Button from './Button.svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { toasts } from '$stores';
	import { hideAll } from 'tippy.js';
	import { invalidateAll } from '$app/navigation';

	export let tracks: (SpotifyApi.TrackObjectFull | SpotifyApi.TrackObjectSimplified)[];
	export let isOwner = false;
	export let userPlaylists: SpotifyApi.PlaylistObjectSimplified[] | undefined = undefined;

	let currentlyPlaying: string | null = null;
	let isPaused = false;
	let isAddToPlaylist: string[] = [];
	let isRemovingFromPlaylist: string[] = [];
</script>

<!-- row header -->
<div class="header mb-4 flex items-center rounded border-b border-white/10 p-5">
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
	<div
		class="row group flex items-center rounded px-1 py-2 hover:bg-white/5 lg:max-w-[calc(100vw-8rem)]"
	>
		<!-- number column -->
		<div class="number-column flex w-8 items-center justify-center">
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
				className="group-hover:flex items-centerx hidden"
			/>
		</div>

		<!-- info column -->
		<div class="flex-1 pl-3">
			<!-- track title -->
			<div class="flex items-center">
				<h4
					class={cn(
						'line-clamp-1 text-xl font-semibold',
						track.id === currentlyPlaying && 'text-accent'
					)}
				>
					{track.name}
				</h4>

				{#if track.explicit}
					<span
						class="ml-2 rounded border border-white/10 px-2 py-0.5 text-[8px] uppercase text-light-gray"
					>
						Explicit
					</span>
				{/if}
			</div>

			<!-- artists -->
			<p class="m-0 mt-2 line-clamp-2 text-sm text-light-gray">
				{#each track.artists as artist, artistsIndex}
					<a href="/artist/{artist.id}" class="text-inherit hover:brightness-110">{artist.name}</a
					>{#if artistsIndex < track.artists.length - 1}{', '}{/if}
				{/each}
			</p>
		</div>

		<!-- duration column -->
		<div>
			<!-- duration -->
			<span class="duration text-sm text-light-gray">{getDuration(track.duration_ms)}</span>
		</div>

		<!-- actions column -->
		<div class="actions ml-4 w-8">
			{#if isOwner}
				<form
					method="post"
					action="/playlist/{$page.params.id}?/removeItem"
					use:enhance={({ cancel }) => {
						if (isRemovingFromPlaylist.includes(track.id)) {
							cancel();
						}

						isRemovingFromPlaylist = [...isRemovingFromPlaylist, track.id];

						return ({ result }) => {
							if (result.type === 'error') {
								toasts.error(result.error.message);
							}

							if (result.type === 'redirect') {
								const url = new URL(`${$page.url.origin}${result.location}`);
								const error = url.searchParams.get('error');
								const success = url.searchParams.get('success');

								if (error) {
									toasts.error(error);
								}

								if (success) {
									toasts.success(success);
									invalidateAll();
								}
							}

							isRemovingFromPlaylist = isRemovingFromPlaylist.filter((t) => t !== track.id);
						};
					}}
				>
					<input hidden name="track" value={track.id} />

					<button
						type="submit"
						title="Remove {track.name} from playlist"
						aria-label="Remove {track.name} from playlist"
					>
						<ListX
							aria-hidden={true}
							focusable="false"
							class="text-light-gray hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</button>
				</form>
			{:else}
				<button
					title="Add {track.name} to playlist"
					aria-label="Add {track.name} to playlist"
					disabled={!userPlaylists}
					use:tippy={{
						content: document.getElementById(`${track.id}-playlist-menu`) || undefined,
						allowHTML: true,
						trigger: 'click',
						interactive: true,
						theme: 'menu',
						placement: 'bottom-end',
						onMount: () => {
							const template = document.getElementById(`${track.id}-playlist-menu`);

							if (template) {
								template.classList.remove('hidden');
							}
						}
					}}
					class="add-btn"
				>
					<ListPlus
						aria-hidden={true}
						focusable="false"
						class="text-light-gray hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</button>

				<!-- tippy popup -->
				{#if userPlaylists}
					<!-- playlist menu -->
					<div id="{track.id}-playlist-menu" class="hidden">
						<!-- playlist menu content -->
						<form
							method="post"
							action="/playlist?/addItem&redirect={$page.url.pathname}"
							class="p-4"
							use:enhance={({ cancel }) => {
								if (isAddToPlaylist.includes(track.id)) {
									cancel();
								}

								isAddToPlaylist = [...isAddToPlaylist, track.id];

								return ({ result }) => {
									if (result.type === 'error') {
										toasts.error(result.error.message);
									}

									if (result.type === 'redirect') {
										const url = new URL(`${$page.url.origin}${result.location}`);

										const error = url.searchParams.get('error');
										const success = url.searchParams.get('success');

										if (error) {
											toasts.error(error);
										}

										if (success) {
											toasts.success(success);
											hideAll(); // on success hide all tippy popups
										}
									}

									isAddToPlaylist = isAddToPlaylist.filter((id) => id !== track.id);
								};
							}}
						>
							<!-- this is just to access track id in action -->
							<input hidden value={track.id} name="track" />

							<!-- field -->
							<select
								name="playlist"
								id=""
								aria-label="Playlist"
								class="h-9 w-full rounded bg-white/10 p-2"
							>
								{#each userPlaylists as playlist}
									<option value={playlist.id} class="border-none bg-background/90">
										{playlist.name}
									</option>
								{/each}
							</select>

							<!-- submit button -->

							<div class="mt-4 text-center">
								<Button element="button" type="submit" className="px-5">
									Add <span class="sr-only"> to selected playlist.</span>
								</Button>
							</div>
						</form>
					</div>
				{/if}
			{/if}
		</div>
	</div>
{/each}

<!-- styles for when js is disabled  -->
<style lang="postcss">
	:global(html.no-js) .header {
		@apply hidden sm:flex;
	}

	:global(html.no-js) .number-column {
		@apply mr-2 w-36 sm:w-56;
	}

	:global(html.no-js) .number-column span {
		@apply hidden;
	}

	:global(html.no-js) .actions {
		@apply hidden;
	}

	:global(html.no-js) .duration {
		@apply mr-8;
	}
</style>
