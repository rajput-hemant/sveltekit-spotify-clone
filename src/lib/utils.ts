import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

/**
 * Merges the given class names with the tailwind classes
 * @param inputs The class names to merge
 * @returns The merged class names
 */
export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

/**
 * Fetches a path, and if the response is 401, refreshes the token and tries again.
 * @param fetch Fetch function from sveltekit
 * @param path Path to fetch
 * @returns Response from fetch
 */
export const fetchRefresh = async (
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>,
	path: string
) => {
	const request = fetch(path);

	// if request is made on server, return request,
	// as it will refresh the token on the server
	if (!browser) return request;

	const response = await request;

	// if the response is 401, refresh the token and try again
	// else return the response
	if (response.status === 401) {
		/* all this is to prevent multiple refresh requests at the same time */
		// if there is already a refresh request, wait for it to finish
		if (!window.refreshPromise) {
			// if there is no refresh request, create one
			window.refreshPromise = fetch('/api/auth/refresh')
				// when the refresh request is done, set the refresh promise to undefined in the window object
				.finally(() => {
					window.refreshPromise = undefined;
				});
		}

		const refreshRes = await window.refreshPromise;

		// if the refresh request fails, throw an error
		if (!refreshRes.ok) {
			throw error(401, 'Session Expired!');
		}

		return fetch(path);
	} else {
		return response;
	}
};

/**
 * Returns the correct symbol for the given type
 * @param type The type of symbol to get
 * @returns The symbol
 */
export const getCopyrightSymbol = (type: string): string => {
	switch (type) {
		case 'R':
			return '®';
		case 'P':
			return '℗';
		case 'C':
			return '©';
		default:
			return type;
	}
};

/**
 * Returns the duration in the format mm:ss
 * @param duration The duration in miliseconds
 * @returns The duration in the format mm:ss
 */
export const getDuration = (duration: number): string => {
	const minutes = Math.floor(duration / 60000);
	const seconds = Math.floor((duration % 60000) / 1000);

	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
