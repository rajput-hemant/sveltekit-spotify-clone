<script lang="ts">
	import { tick, type ComponentType } from 'svelte';
	import { fade } from 'svelte/transition';
	import NavigationItem from './NavigationItem.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { Home, Search, ListMusic, type Icon, Menu, X } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import IconButton from './IconButton.svelte';

	type MenuItem = {
		path: string;
		label: string;
		icon: ComponentType<Icon>;
	};

	export let desktop = false;

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
			on:keyup={handleEsc}
			class={cn(
				'z-50 hidden h-screen min-w-[16rem] translate-x-0 overflow-auto bg-sidebar p-5 transition-all duration-300',
				desktop && 'md:block',
				!desktop && 'fixed left-0 top-0 block md:hidden',
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
	</nav>
</div>
