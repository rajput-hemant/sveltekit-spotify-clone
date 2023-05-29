<script lang="ts">
	import Button from '$components/Button.svelte';
	import ItemPage from '$components/ItemPage.svelte';
	import TrackList from '$components/TrackList.svelte';
	import { Heart, Loader2 } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';
	import { toasts } from '$stores';
	import Pagination from '$components/Pagination.svelte';

	export let data: PageData;
	export let form: ActionData;

	$: color = data.color;
	$: playlist = data.playlist;
	$: psuedoTracks = data.playlist.tracks;
	$: isFollowing = data.isFollowing;

	let tracks: SpotifyApi.TrackObjectFull[];
	let isLoading = false;
	let isFollowLoading = false;
	let followButton: Button<'button'>;

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
			toasts.error(data.error.message || 'Error loading more tracks');
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

	<!-- playlist actions -->
	<div class="mb-7 mt-2.5 flex justify-end">
		{#if data.user?.id === playlist.owner.id}
			<Button element="a">Edit Playlist</Button>
		{:else if isFollowing !== null}
			<!-- follow form -->
			<form
				method="post"
				action="?/{isFollowing ? 'unfollowPlaylist' : 'followPlaylist'}"
				use:enhance={() => {
					isFollowLoading = true;
					return async ({ result }) => {
						isFollowLoading = false;
						if (result.type === 'success') {
							// this will not invalidate the page, unlike the `update` function
							await applyAction(result);
							isFollowing = !isFollowing;
						} else if (result.type === 'failure') {
							toasts.error(result.data?.followError || 'Error following playlist');
						} else {
							await applyAction(result);
						}

						// focus back on the button when using the keyboard
						followButton.focus();
					};
				}}
			>
				<Button
					bind:this={followButton}
					element="button"
					variant="outline"
					type="submit"
					disabled={isFollowLoading}
				>
					{#if isFollowLoading}
						<Loader2 class="mr-2.5 animate-spin" />
					{:else}
						<Heart
							aria-hidden
							focusable="false"
							fill={isFollowing ? 'white' : 'transparent'}
							class="mr-2.5"
						/>
					{/if}
					{isFollowing ? 'Unfollow' : 'Follow'}
					<span class="sr-only">{playlist.name} playlist</span>
				</Button>

				<!-- error -->
				{#if form?.followError}
					<p class="text-right text-sm text-error">{form.followError}</p>
				{/if}
			</form>
		{/if}
	</div>

	{#if psuedoTracks.items.length > 0}
		<TrackList {tracks} />

		<!-- pagination -->
		<Pagination list={psuedoTracks} on:loadmore={loadMore} {isLoading} />
	{:else}
		<!-- empty playlist -->
		<div class="mt-10 space-x-3 text-center">
			<p class="text-2xl font-semibold">No items added to this playlist yet!</p>

			<Button element="a" href="/search">Search for Content</Button>
			<Button element="a" href="/playlists">View all Playlist</Button>
		</div>
	{/if}
</ItemPage>
