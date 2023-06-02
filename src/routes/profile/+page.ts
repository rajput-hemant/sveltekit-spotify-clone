import { fetchRefresh } from '$lib/utils';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { user } = await parent();

	const followingReq = fetchRefresh(fetch, '/api/spotify/me/following?type=artist&limit=6');

	let colorReq;

	if (user?.images && user.images.length > 0) {
		colorReq = fetchRefresh(fetch, `/api/sharp?image=${user.images[0].url}`);
	}

	const [followingResponse, colorResponse] = await Promise.all([followingReq, colorReq]);

	return {
		title: user?.display_name,
		following: followingResponse.ok
			? (followingResponse.json() as Promise<SpotifyApi.UsersFollowedArtistsResponse>)
			: undefined,

		color: colorResponse?.ok ? colorResponse.json().then((r) => r.color) : null
	};
};
