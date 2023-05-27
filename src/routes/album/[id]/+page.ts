import { fetchRefresh } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

/** Load the album page */
export const load: PageLoad = async ({ fetch, params }) => {
	const response = await fetchRefresh(fetch, `/api/spotify/albums/${params.id}`);

	if (!response.ok) {
		throw error(response.status, 'Failed to fetch album!');
	}

	const album: SpotifyApi.SingleAlbumResponse = await response.json();
	let color = null;

	if (album.images.length > 0) {
		const colorRes = await fetch(`/api/sharp?image=${album.images[0].url}`);

		if (colorRes.ok) {
			color = (await colorRes.json()).color;
		}
	}

	return {
		title: album.name,
		album: album,
		color
	};
};
