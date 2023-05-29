<script lang="ts">
	import Button from '$components/Button.svelte';
	import { cn } from '$lib/utils';
	import type { ActionData as AddActionData } from '../routes/playlists/$types';
	import type { ActionData as EditActionData } from '../routes/playlist/[id]/$types';
	import { enhance } from '$app/forms';

	export let form: AddActionData | EditActionData;
	export let userId: string | undefined = undefined;
	export let action: string | undefined = undefined;
	export let playlist:
		| SpotifyApi.PlaylistObjectFull
		| SpotifyApi.PlaylistObjectSimplified
		| undefined = undefined;
</script>

<form method="post" {action} use:enhance>
	{#if userId}
		<input hidden name="userId" value={userId} />
	{/if}

	<!-- field -->
	<div class="mb-5">
		<label for="playlist-name" class="mb-2.5 inline-block text-sm">Name *</label>

		<input
			type="text"
			id="playlist-name"
			name="name"
			placeholder="Playlist Name"
			value={form?.name ?? playlist?.name ?? ''}
			class={cn('w-full', form?.nameError && 'outline-none outline-error')}
		/>

		{#if form?.nameError}
			<!-- error -->
			<p class="text-sm text-error">{form.nameError}</p>
		{/if}
	</div>

	<!-- field -->
	<div class="mb-5">
		<label for="playlist-description" class="mb-2.5 inline-block text-sm">Description</label>

		<input
			type="text"
			id="playlist-description"
			name="description"
			placeholder="Playlist Description"
			value={form?.description ?? playlist?.description ?? ''}
			class="w-full"
		/>
	</div>

	{#if form?.apiError}
		<p class="text-sm text-error">{form.apiError}</p>
	{/if}

	<!-- submit button -->
	<div class="mt-10 text-right">
		<Button element="button" type="submit">{playlist ? 'Save' : 'Create'} Playlist</Button>
	</div>
</form>
