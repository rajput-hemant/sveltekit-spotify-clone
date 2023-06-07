<script lang="ts">
	import Card from '$components/Card.svelte';
	import Pagination from '$components/Pagination.svelte';
	import { toasts } from '$stores';
	import type { PageData } from './$types';

	export let data: PageData;
	$: items = data.data;

	let isLoading = false;

	const onLoadMoreItems = async () => {
		if (items && 'next' in items && items.next) {
			isLoading = true;
			const response = await fetch(
				items.next.replace('https://api.spotify.com/v1/', '/api/spotify/')
			);

			if (response.ok) {
				const data = await response.json();

				const item = data.albums || data.playlists || data.artists || data;

				items = { ...item, items: [...items.items, ...item.items] };
			} else {
				toasts.error('Could not load data!');
			}
			isLoading = false;
		}
	};
</script>

<div class="pb-16">
	<h1>{data.title}</h1>

	{#if items?.items}
		<div class="grid-items mb-10">
			{#each items.items as item}
				<div class="grid-item">
					<Card {item} />
				</div>
			{/each}
		</div>

		{#if 'next' in items}
			<Pagination list={items} on:loadmore={onLoadMoreItems} {isLoading} />
		{/if}
	{/if}
</div>
