import { redirect } from '@sveltejs/kit';
import pkce from 'pkce-gen';
import type { RequestHandler } from './$types';
import { BASE_URL, SPOTIFY_APP_CLIENT_ID } from '$env/static/private';

const scope =
	'ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing streaming app-remote-control user-read-email user-read-private playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private user-library-modify user-library-read user-top-read user-read-playback-position user-read-recently-played';

const generateRandomString = (length: number) => {
	let result = '';

	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	const charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

const state = generateRandomString(16);
const challenge = pkce.create();

export const GET: RequestHandler = ({ cookies }) => {
	/* set state and code_verifier in cookies so we can use them in callback */
	cookies.set('spotify_auth_state', state);
	cookies.set('spotify_auth_challenger_verifier', challenge.code_verifier);

	throw redirect(
		307,
		`https://accounts.spotify.com/authorize?${new URLSearchParams({
			response_type: 'code',
			client_id: SPOTIFY_APP_CLIENT_ID,
			scope,
			redirect_uri: `${BASE_URL}/api/auth/callback`,
			state,
			code_challenge_method: 'S256',
			code_challenge: challenge.code_challenge
		})}`
	);
};
