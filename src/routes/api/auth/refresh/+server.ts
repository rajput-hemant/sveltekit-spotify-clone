import { SPOTIFY_APP_CLIENT_ID, SPOTIFY_APP_CLIENT_SECRET } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, fetch }) => {
	const refresh_token = cookies.get('refresh_token');

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(
				`${SPOTIFY_APP_CLIENT_ID}:${SPOTIFY_APP_CLIENT_SECRET}`
			).toString('base64')}`
		},

		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refresh_token ?? ''
		})
	});

	const responseJSON = await response.json();

	// if the refresh token is invalid, delete the cookies and throw an error
	if (responseJSON.error) {
		cookies.delete('access_token', { path: '/' });
		cookies.delete('refresh_token', { path: '/' });

		throw error(401, responseJSON.error_description);
	}

	// otherwise, set the cookies and return the response
	cookies.set('access_token', responseJSON.access_token, { path: '/' });
	cookies.set('refresh_token', responseJSON.refresh_token, { path: '/' });

	return json(responseJSON);
};
