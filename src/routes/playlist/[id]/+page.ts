import { fetchRefresh } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

/** Load the playlist page */
export const load: PageLoad = async ({ fetch: _fetch, params, depends, route, url }) => {
	// this will be used to invalidate the load function
	depends(`app:${route.id}`);

	const fetch = (path: string) => fetchRefresh(_fetch, path);

	const limit = 100;
	const page = url.searchParams.get('page');

	const response = await fetch(`/api/spotify/playlists/${params.id}`);

	if (!response.ok) {
		throw error(response.status, 'Failed to load playlist!');
	}

	const playlist: SpotifyApi.SinglePlaylistResponse = await response.json();

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
		const response = await fetch(`/api/sharp?image=${playlist.images[0].url}`);

		if (response.ok) {
			color = (await response.json()).color;
		}
	}

	return {
		title: playlist.name,
		playlist,
		color
	};
};
