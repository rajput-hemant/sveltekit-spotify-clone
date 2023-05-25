import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BASE_URL, SPOTIFY_APP_CLIENT_ID, SPOTIFY_APP_CLIENT_SECRET } from '$env/static/private';

export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
	// get code and state from url
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	// get state and code_verifier from cookies
	const storedState = cookies.get('spotify_auth_state');
	const storedChallengerVerifier = cookies.get('spotify_auth_challenger_verifier');

	// check if state and code_verifier are the same as in cookies
	// if not, throw error
	if (state === null || state !== storedState) {
		throw error(400, 'state_mismatch');
	}

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(
				`${SPOTIFY_APP_CLIENT_ID}:${SPOTIFY_APP_CLIENT_SECRET}`
			).toString('base64')}`
		},
		body: new URLSearchParams({
			code: code ?? '',
			redirect_uri: `${BASE_URL}/api/auth/callback`,
			grant_type: 'authorization_code',
			code_verifier: storedChallengerVerifier ?? '',
			client_id: SPOTIFY_APP_CLIENT_ID
		})
	});

	const responseJSON = await response.json();

	if (responseJSON.error) {
		throw error(400, responseJSON.error_description);
	}

	// delete state and code_verifier from cookies as we don't need them anymore
	cookies.delete('spotify_auth_state');
	cookies.delete('spotify_auth_challenger_verifier');
	// set access_token and refresh_token in cookies
	cookies.set('access_token', responseJSON.access_token, { path: '/' });
	cookies.set('refresh_token', responseJSON.refresh_token, { path: '/' });

	// redirect to home page
	throw redirect(303, '/');
};
