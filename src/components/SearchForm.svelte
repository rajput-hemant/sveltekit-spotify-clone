<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { Search } from 'lucide-svelte';

	let searchInput: HTMLInputElement;

	$: searchQuery = $page.params.query || '';

	afterNavigate(() => {
		searchInput.focus();
	});
</script>

<form action="/search" method="GET" role="search">
	<div class="relative flex items-center">
		<Search aria-hidden focusable="false" class="absolute ml-3 h-6 w-6 stroke-medium-gray" />

		<input
			bind:this={searchInput}
			value={searchQuery}
			name="q"
			class="w-full rounded-3xl pl-10 pr-5 text-medium-gray lg:w-fit"
			type="search"
			size="30"
			placeholder="Search for albums, artists or playlists."
			aria-label="Search for albums, artists or playlists."
		/>
	</div>
</form>
