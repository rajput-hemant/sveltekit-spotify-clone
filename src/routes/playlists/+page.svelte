<script lang="ts">
	import Button from '$components/Button.svelte';
	import PlaylistForm from '$components/PlaylistForm.svelte';
	import Card from '$components/Card.svelte';
	import { Plus, X } from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';
	import Pagination from '$components/Pagination.svelte';
	import { toasts } from '$stores';

	export let data: PageData;
	export let form: ActionData;
	let dialog: HTMLDialogElement;

	$: playlists = data.userPlaylists;

	let isLoading = false;

	const loadMoreItems = async () => {
		if (!playlists.next) return;

		isLoading = true;
		const response = await fetch(
			playlists.next.replace('https://api.spotify.com/v1', '/api/spotify')
		);
		const data = await response.json();

		if (response.ok) {
			playlists = {
				...data,
				items: [...playlists.items, ...data.items]
			};
		} else {
			toasts.error(data.error.message || 'Error loading more.');
		}

		isLoading = false;
	};
</script>

<!-- content -->
<div class="py-5">
	{#if playlists.items.length > 0}
		<!-- title -->
		<div class="flex items-center justify-between">
			<h1>{data.title}</h1>

			<Button element="button" on:click={() => dialog.showModal()} className="items-center gap-1">
				<Plus class="h-5 w-5" /> Add New
			</Button>
		</div>

		<!-- grid items -->
		<div class="grid-items my-10">
			{#each playlists.items as item}
				<div>
					<Card {item} />
				</div>
			{/each}
		</div>

		<!-- pagination -->
		<Pagination list={playlists} on:loadmore={loadMoreItems} {isLoading} />
	{:else}
		<!-- empty playlist -->
		<div class="mt-10 space-x-3 text-center">
			<p class="text-2xl font-semibold">No Playlist yet!</p>

			<Button element="a" href="/playlists/new"><Plus class="h-5 w-5" /> Add New</Button>
		</div>
	{/if}
</div>

<dialog bind:this={dialog} class="relative min-w-[30rem] max-w-[40rem] p-10">
	<!-- close button -->
	<div class="absolute right-0 top-0 p-5">
		<button on:click={() => dialog.close()} class="text-white/50 hover:text-white"><X /></button>
	</div>

	<h2 class="mb-5">Add a New Playlist</h2>

	<PlaylistForm userId={data.user?.id} {form} />
</dialog>
