<script lang="ts">
	import { tick, type ComponentType } from 'svelte';
	import { fade } from 'svelte/transition';
	import NavigationItem from './NavigationItem.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { Home, Search, ListMusic, type Icon, Menu, X, Music } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import IconButton from './IconButton.svelte';
	import { page } from '$app/stores';
	import Skeleton from './Skeleton.svelte';

	type MenuItem = {
		path: string;
		label: string;
		icon: ComponentType<Icon>;
	};

	const menuItems: MenuItem[] = [
		{
			path: '/',
			label: 'Home',
			icon: Home
		},
		{
			path: '/search',
			label: 'Search',
			icon: Search
		},
		{
			path: '/playlists',
			label: 'Playlists',
			icon: ListMusic
		}
	];

	export let desktop = false;
	export let userAllPlaylists: SpotifyApi.PlaylistObjectSimplified[] | undefined = undefined;

	// refs
	let openMenuButton: IconButton;
	let closeMenuButton: IconButton;
	let lastFocusableElement: HTMLElement;

	$: isMobileMenuOpen = false;

	const openMenu = async () => {
		isMobileMenuOpen = true;

		// wait for dom to update
		await tick();
		// focus close button
		closeMenuButton.getButton().focus();
	};

	const closeMenu = () => {
		isMobileMenuOpen = false;
		// focus open button
		openMenuButton.getButton().focus();
	};

	// focus last focusable element
	const moveFocusToTop = (e: KeyboardEvent) => {
		if (desktop) return;

		if (e.key === 'Tab' && !e.shiftKey) {
			e.preventDefault();
			lastFocusableElement.focus();
		}
	};

	// focus first focusable element
	const moveFocusToBottom = (e: KeyboardEvent) => {
		if (desktop) return;

		if (e.key === 'Tab' && e.shiftKey) {
			e.preventDefault();
			closeMenuButton.getButton().focus();
		}
	};

	const handleEsc = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			closeMenu();
		}
	};

	// close menu on navigation
	beforeNavigate(() => {
		isMobileMenuOpen = false;
	});
</script>

<!-- to disable scroll when mobile menu is open -->
<svelte:head>
	{#if !desktop && isMobileMenuOpen}
		<style>
			body {
				overflow: hidden;
			}
		</style>
	{/if}
</svelte:head>

<!-- nav content -->
<div class="sticky top-0">
	{#if isMobileMenuOpen && !desktop}
		<div
			on:click={closeMenu}
			on:keyup={handleEsc}
			transition:fade={{ duration: 300 }}
			class="fixed left-0 top-0 h-full w-full bg-black/75 md:hidden"
		/>
	{/if}

	<nav aria-label="Main">
		{#if !desktop}
			<IconButton
				icon={Menu}
				label="Open Menu"
				bind:this={openMenuButton}
				aria-expanded={isMobileMenuOpen}
				on:click={openMenu}
				on:keydown={moveFocusToBottom}
				class="md:hidden"
			/>
		{/if}

		<!-- nav content innner -->
		<div
			id="nav-content-inner"
			on:keyup={handleEsc}
			class={cn(
				'z-50 hidden h-screen w-64 translate-x-0 bg-sidebar transition-all duration-300 lg:w-80',
				desktop && 'flex-col md:flex',
				!desktop && 'fixed left-0 top-0 flex flex-col md:hidden',
				!(desktop || isMobileMenuOpen) && 'invisible -translate-x-full opacity-0'
			)}
		>
			{#if !desktop}
				<IconButton
					icon={X}
					label="Close Menu"
					bind:this={closeMenuButton}
					on:click={closeMenu}
					class="absolute right-5 top-5"
				/>
			{/if}

			<!-- logo and menu -->
			<div class="px-5 pt-5">
				<!-- logo -->
				<img src="/assets/spotify-logo.png" alt="Spotify Logo" class="w-32 max-w-full" />

				<ul class="mt-5">
					{#each menuItems as item, index}
						<li>
							{#if menuItems.length === index + 1}
								<NavigationItem ref={lastFocusableElement} {item} onKeyDown={moveFocusToTop} />
							{:else}
								<NavigationItem {item} />
							{/if}
						</li>
					{/each}
				</ul>
			</div>

			{#if userAllPlaylists && userAllPlaylists.length > 0}
				<ul class="overflow-y-scroll border-t border-white/10 px-2 pt-5 lg:px-5">
					{#each userAllPlaylists as playlist}
						<li
							class={cn(
								'group relative mb-2 flex h-16 gap-2 overflow-hidden rounded p-1 hover:bg-dark-gray',
								playlist.id === $page.params.id && 'bg-dark-gray font-semibold'
							)}
						>
							{#if playlist.images.length > 0}
								<!-- image -->
								<div
									class="relative aspect-square w-14 overflow-hidden rounded shadow-md shadow-black"
								>
									<img
										src={playlist.images[0].url}
										alt={playlist.name}
										class="w-full object-cover"
									/>

									<Skeleton className="absolute inset-0 -z-10" />
								</div>
							{:else}
								<!-- image placeholder -->
								<div
									class="flex aspect-square w-14 items-center justify-center rounded bg-medium-gray shadow-md shadow-black"
								>
									<Music focusable="false" aria-hidden={true} class="h-3/5 w-3/5 text-light-gray" />
								</div>
							{/if}

							<div class="flex flex-col justify-between p-1">
								<a
									class="line-clamp-1 cursor-pointer text-lg font-semibold text-text after:absolute after:inset-0"
									href="/playlist/{playlist.id}"
								>
									{playlist.name}
								</a>

								<span class="line-clamp-1 text-sm text-white/75">
									{playlist.owner.display_name ?? 'N/A'}
								</span>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</nav>
</div>

<style lang="postcss">
	/* show navigation menu when js is disabled */
	:global(html.no-js) #nav-content-inner {
		@apply block h-auto md:h-screen;
	}

	:global(html.no-js) #nav-content-inner > ul {
		@apply hidden md:block;
	}
</style>
