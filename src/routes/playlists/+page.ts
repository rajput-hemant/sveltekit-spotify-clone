import { fetchRefresh } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageLoad } from '../$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const limit = 18;
	const page = url.searchParams.get('page');

	const response = await fetchRefresh(
		fetch,
		`/api/spotify/me/playlists?limit=${limit}&offset=${page ? (parseInt(page) - 1) * limit : 0}`
	);

	if (!response.ok) {
		throw error(response.status, 'Failed to load Playlists!');
	}

	const playlists: SpotifyApi.ListOfCurrentUsersPlaylistsResponse = await response.json();

	return {
		title: 'Your Playlists',
		userPlaylists: playlists
	};
};
