import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { fetchRefresh } from '$lib/utils';

export const load: PageLoad = async ({ fetch, params, depends, route }) => {
	depends(`app:${route.id}`);
	const query = params.query;

	const repsonse = await fetchRefresh(
		fetch,
		`/api/spotify/search?q=${query}&type=album,artist,playlist&limit=6`
	);

	if (!repsonse.ok) {
		throw error(repsonse.status, 'Failed to load results!');
	}

	const results: SpotifyApi.SearchResponse = await repsonse.json();

	return {
		title: `Search results for: ${query}`,
		searchResults: results
	};
};
