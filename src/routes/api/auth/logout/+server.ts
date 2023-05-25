import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = ({ cookies, request }) => {
	cookies.delete('access_token', { path: '/' });
	cookies.delete('refresh_token', { path: '/' });

	// if we are logging out using fetch, return a JSON response
	if (request.headers.get('accept') === 'application/json') {
		return json({ sucess: true });
	}

	// otherwise, redirect to the login page
	throw redirect(303, '/login');
};
