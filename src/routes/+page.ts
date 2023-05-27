import type { PageLoad } from './$types';
import { fetchRefresh } from '$lib/utils';

export const load: PageLoad = async ({ fetch: _fetch }) => {
	const fetch = (path: string) => fetchRefresh(_fetch, path);

	// fetch call for new releases, featured playlists, user playlists
	const newReleases = fetch('api/spotify/browse/new-releases?limit=6');
	const featuredPlaylists = fetch('api/spotify/browse/featured-playlists?limit=6');
	const userPlaylists = fetch('api/spotify/me/playlists?limit=6');

	// fetch call to get all categories
	const categories = await fetch('api/spotify/browse/categories');
	const categoriesRes: SpotifyApi.MultipleCategoriesResponse | undefined = categories.ok
		? await categories.json()
		: undefined;

	// get 3 random categories
	const randomCategories =
		categoriesRes?.categories.items.sort(() => Math.random()).slice(0, 3) ?? [];

	// fetch call for playlists for each category
	const categoryPlaylists = randomCategories.map((category) =>
		fetch(`api/spotify/browse/categories/${category.id}/playlists?limit=6`)
	);

	// fetch all calls parallelly
	const [newReleasesRes, featuredPlaylistsRes, userPlaylistsRes, ...randomCatsRes] =
		await Promise.all([newReleases, featuredPlaylists, userPlaylists, ...categoryPlaylists]);

	return {
		newReleases: newReleasesRes.ok
			? (newReleasesRes.json() as Promise<SpotifyApi.ListOfNewReleasesResponse>)
			: undefined,

		featuredPlaylists: featuredPlaylistsRes.ok
			? (featuredPlaylistsRes.json() as Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse>)
			: undefined,

		userPlaylists: userPlaylistsRes.ok
			? (userPlaylistsRes.json() as Promise<SpotifyApi.ListOfUsersPlaylistsResponse>)
			: undefined,

		homeCategories: randomCategories,

		categoriesPlaylists: Promise.all(
			randomCatsRes.map((res) =>
				res.ok ? (res.json() as Promise<SpotifyApi.CategoryPlaylistsResponse>) : undefined
			)
		)
	};
};
