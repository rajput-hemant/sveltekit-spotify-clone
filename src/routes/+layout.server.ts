// this function runs every time the root layout is rendered

import { SPOTIFY_BASE_URL } from '$env/static/private';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ cookies, fetch, url }) => {
	const access_token = cookies.get('access_token');
	const refresh_token = cookies.get('refresh_token');

	// if there's no access token, we're not logged in
	if (!access_token)
		return {
			user: null
		};

	// if we do have an access token, we can use it to retrieve the user's profile
	const response = await fetch(`${SPOTIFY_BASE_URL}/me`, {
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});

	if (response.ok) {
		const profile = await response.json();
		let userAllPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];
		const userPlaylistsRes = await fetch('/api/spotify/me/playlists?limit=50');

		if (userPlaylistsRes.ok) {
			const userPlaylists: SpotifyApi.ListOfCurrentUsersPlaylistsResponse =
				await userPlaylistsRes.json();
			userAllPlaylists = userPlaylists.items;
		}

		return {
			user: profile as SpotifyApi.CurrentUsersProfileResponse,
			userAllPlaylists
		};
	} else if (response.status === 401 && refresh_token) {
		// refresh the token
		const refreshRes = await fetch('/api/auth/refresh');

		if (refreshRes.ok) {
			// if the refresh was successful, try loading the user again
			throw redirect(307, url.pathname);
		} else {
			// if the refresh failed, we're not logged in
			return {
				user: null
			};
		}
	} else {
		return {
			user: null
		};
	}
};
