<script lang="ts">
	import Button from '$components/Button.svelte';
	import Card from '$components/Card.svelte';
	import ItemPage from '$components/ItemPage.svelte';
	import { element } from 'svelte/internal';
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';

	export let data: PageData;

	$: user = data.user;
	$: color = data.color;
	$: following = data.following;

	let isRetrying = false;
	const formatFollowers = Intl.NumberFormat('en-US', { notation: 'compact' }).format;
</script>

<ItemPage
	{color}
	type={user?.type}
	title={data.title || ''}
	image={user?.images && user.images.length > 0 ? user.images[0].url : undefined}
	bannerClass="items-center text-center sm:text-left"
	imageClass="rounded-full"
>
	<span slot="meta" class="text-sm text-light-gray">
		{formatFollowers(user?.followers?.total ?? 0)} Followers
	</span>

	{#if following === undefined}
		<div class="mt-10 text-center">
			<p>Failed to load data.</p>

			<Button
				element="button"
				disabled={isRetrying}
				on:click={async () => {
					isRetrying = true;
					await invalidate((url) => url.pathname === '/api/spotify/me/following');
					isRetrying = false;
				}}>Try again</Button
			>
		</div>
	{/if}

	{#if following && following.artists.items.length > 0}
		<!-- following -->
		<div class="">
			<h2>Following</h2>

			<div class="grid-items">
				{#each following.artists.items as artist}
					<!-- grid item -->
					<div class="">
						<Card item={artist} />
					</div>{/each}
			</div>

			<!-- view all button -->
			<div class="mt-7 text-right">
				<Button element="a" href="/profile/artists" variant="outline"
					>View All <span class="sr-only">artists that you are following</span></Button
				>
			</div>
		</div>
	{/if}
</ItemPage>
