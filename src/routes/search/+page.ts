import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { fetchRefresh } from '$lib/utils';

export const load: PageLoad = async ({ fetch, url }) => {
	const query = url.searchParams.get('q');
	if (query) {
		throw redirect(307, `/search/${query}`);
	}

	const repsonse = await fetchRefresh(fetch, `/api/spotify/browse/categories?limit=50`);

	return {
		title: 'Search',
		categories: repsonse.ok
			? (repsonse.json() as Promise<SpotifyApi.MultipleCategoriesResponse>)
			: undefined
	};
};
