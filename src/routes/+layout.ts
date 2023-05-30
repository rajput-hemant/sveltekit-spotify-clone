import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ data, url }) => {
	const { user, userAllPlaylists } = data ?? {};

	// if we're not logged in, redirect to the login page
	if (!user && url.pathname !== '/login') throw redirect(307, '/login');

	// if we are logged in, redirect to the home page
	if (user && url.pathname === '/login') throw redirect(307, '/');

	return {
		user,
		userAllPlaylists
	};
};
