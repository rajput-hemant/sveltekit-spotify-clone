import { SPOTIFY_BASE_URL } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	followPlaylist: async ({ cookies, params }) => {
		const res = await fetch(`${SPOTIFY_BASE_URL}/playlists/${params.id}/followers`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('access_token')}`
			}
		});

		if (!res.ok) {
			return fail(res.status, { followError: res.statusText });
		}
	},

	unfollowPlaylist: async ({ cookies, params }) => {
		const res = await fetch(`${SPOTIFY_BASE_URL}/playlists/${params.id}/followers`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('access_token')}`
			}
		});

		if (!res.ok) {
			return fail(res.status, { followError: res.statusText });
		}
	},

	editPlaylist: async ({ fetch, request, cookies, params }) => {
		const data = await request.formData();

		const name = data.get('name');
		const description = data.get('description');

		if (!name) {
			return fail(400, {
				name,
				description,
				nameError: 'Playlist name is required!',
				apiError: false
			});
		}

		const response = await fetch(`${SPOTIFY_BASE_URL}/playlists/${params.id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`
			},
			body: JSON.stringify({ name, description: description || undefined })
		});

		if (!response.ok) {
			const errorJSON = await response.json();
			return fail(response.status, {
				name,
				description,
				apiError: errorJSON?.error?.message ?? 'An error occurred while creating the playlist',
				nameError: false
			});
		} else {
			throw redirect(303, `/playlist/${params.id}`);
		}
	}
};
