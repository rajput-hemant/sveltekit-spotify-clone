import { SPOTIFY_BASE_URL } from '$env/static/private';
import { error, json, type RequestHandler } from '@sveltejs/kit';

/**
 * Get Route for Spotify API
 * @returns Response from Spotify API
 */
export const GET: RequestHandler = async ({ cookies, params, url, fetch }) => {
	const accessToken = cookies.get('access_token');

	const response = await fetch(`${SPOTIFY_BASE_URL}/${params.slug}${url.search}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (response.ok) {
		const data = await response.json();

		return json(data);
	} else {
		throw error(response.status, response.statusText);
	}
};
