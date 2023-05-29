import { fetchRefresh } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

/** Load the playlist page */
export const load: PageLoad = async ({ fetch: _fetch, params, depends, route, url, parent }) => {
	// this will be used to invalidate the load function
	depends(`app:${route.id}`);

	const { user } = await parent();

	const fetch = (path: string) => fetchRefresh(_fetch, path);

	const limit = 100;
	const page = url.searchParams.get('page');

	// if we're editing the playlist, we don't need to fetch the tracks
	if (url.searchParams.has('editPlaylist')) {
		const response = await fetch(`/api/spotify/playlists/${params.id}?fields=id,name,description`);

		if (!response.ok) {
			throw error(response.status, 'An error occurred while fetching the playlist');
		}

		const playlist: SpotifyApi.SinglePlaylistResponse = await response.json();

		return {
			title: `Edit ${playlist.name}`,
			playlist
		};
	}

	const [playlistRes, isFollowingRes] = await Promise.all([
		fetch(`/api/spotify/playlists/${params.id}`),
		fetch(`/api/spotify/playlists/${params.id}/followers/contains?ids=${user?.id}`)
	]);

	if (!playlistRes.ok) {
		throw error(playlistRes.status, 'Failed to load playlist!');
	}

	let isFollowing: boolean | null = null;

	if (isFollowingRes.ok) {
		const isFollowingJSON: SpotifyApi.UsersFollowPlaylistResponse = await isFollowingRes.json();

		isFollowing = isFollowingJSON[0];
	}

	const playlist: SpotifyApi.SinglePlaylistResponse = await playlistRes.json();

	if (page && page !== '1') {
		const tracksResponse = await fetch(
			`/api/spotify/playlists/${params.id}/tracks?limit=${limit}&offset=${
				(parseInt(page) - 1) * limit
			}`
		);

		if (!tracksResponse.ok) {
			throw error(tracksResponse.status, 'Failed to load playlist tracks!');
		}

		const tracks: SpotifyApi.PlaylistTrackResponse = await tracksResponse.json();
		playlist.tracks = tracks;
	}

	let color = null;

	if (playlist.images.length > 0) {
		const playlistRes = await fetch(`/api/sharp?image=${playlist.images[0].url}`);

		if (playlistRes.ok) {
			color = (await playlistRes.json()).color;
		}
	}

	return {
		title: playlist.name,
		color,
		playlist,
		isFollowing
	};
};
