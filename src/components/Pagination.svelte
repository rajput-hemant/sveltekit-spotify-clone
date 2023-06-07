<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';

	export let list: SpotifyApi.PagingObject<any> | SpotifyApi.CursorBasedPagingObject<any>;
	export let isLoading: boolean;

	const dispatch = createEventDispatcher<{
		loadmore: { page: number };
	}>();

	// pagination (shows up only when js is disabled)
	$: currentPage = $page.url.searchParams.get('page') || '1';
</script>

{#if list.next}
	<!-- load more -->
	<div class="load-more p-4 text-center">
		<Button
			element="button"
			variant="outline"
			disabled={isLoading}
			on:click={() => dispatch('loadmore')}>Load More <span class="sr-only">Items</span></Button
		>
	</div>
{/if}

<!-- pagination (shows up only when js is disabled) -->
<div class="pagination mt-10 hidden w-full justify-between">
	<!-- previous -->
	{#if 'previous' in list}
		<Button
			element="a"
			href="{$page.url.pathname}?page={parseInt(currentPage) - 1}"
			variant="outline"
			className="group"
		>
			<ArrowLeft class="transition-transform duration-300 group-hover:-translate-x-1" />
			<span>Previous</span>
		</Button>
	{/if}

	<!-- next -->
	{#if list.next}
		<Button
			element="a"
			href="{$page.url.pathname}?page={parseInt(currentPage) + 1}"
			variant="outline"
			className="group ml-auto"
		>
			<span>Next</span>
			<ArrowRight class="transition-transform duration-300 group-hover:translate-x-1" />
		</Button>
	{/if}
</div>

<!-- styles for when js is disabled  -->
<style lang="postcss">
	:global(html.no-js) .load-more {
		display: none;
	}

	:global(html.no-js) .pagination {
		display: flex;
	}
</style>
