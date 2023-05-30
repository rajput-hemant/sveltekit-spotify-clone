<script lang="ts">
	import '@fontsource/metropolis/400.css';
	import '@fontsource/metropolis/500.css';
	import '@fontsource/metropolis/600.css';
	import '@fontsource/metropolis/700.css';

	import '$styles/tippy-theme.css';
	import 'nprogress/nprogress.css';
	import '../app.css';

	import NProgress from 'nprogress';
	// import { hideAll } from 'tippy.js';
	import { page } from '$app/stores';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import Header from '$components/Header.svelte';
	import Navigation from '$components/Navigation.svelte';
	import { cn } from '$lib/utils';
	import type { LayoutData } from './$types';
	import Toasts from '$components/Toasts.svelte';
	import { X } from 'lucide-svelte';

	NProgress.configure({ showSpinner: false });

	export let data: LayoutData;

	$: user = data.user;
	$: userAllPlaylists = data.userAllPlaylists;
	$: hasError = $page.url.searchParams.get('error');
	$: hasSuccess = $page.url.searchParams.get('success');

	let topbar: HTMLElement;
	let scrollY: number;
	let headerOpacity = 0;

	$: if (topbar) {
		headerOpacity = scrollY / topbar.offsetHeight < 1 ? scrollY / topbar.offsetHeight : 1;
	}

	beforeNavigate(() => {
		NProgress.start();
	});

	afterNavigate(() => {
		NProgress.done();

		/* hide all tooltips after navigation
		 * uncomment if `hideOnPopperBlur` is set to false $components/Header.svelte
		 */
		// hideAll();
	});
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>{$page.data.title ? `${$page.data.title} | ` : ''} Svelte Spotify</title>
</svelte:head>

<!-- toast -->
<Toasts />

{#if user}
	<a
		href="#main-content"
		class="sr-only left-2 top-2 z-50 bg-accent p-2 font-medium text-white focus:not-sr-only focus:absolute"
	>
		Skip to Content
	</a>
{/if}

<!-- main -->
<div id="main" class="flex">
	{#if user}
		<aside>
			<Navigation desktop={true} {userAllPlaylists} />
		</aside>
	{/if}
	<!-- content -->
	<div class="flex-1">
		{#if hasError || hasSuccess}
			<!-- message -->
			<div
				class={cn(
					'sticky top-0 z-50 px-5 py-2.5',
					hasError && 'bg-error',
					hasSuccess && 'bg-accent'
				)}
			>
				{hasError ?? hasSuccess}

				<a
					href={$page.url.pathname}
					class="absolute right-2.5 rounded text-text hover:outline-none hover:outline-white"
				>
					<X aria-hidden focusable="false" />
					<span class="sr-only">Close</span>
				</a>
			</div>
		{/if}
		<!-- topbar -->
		{#if user}
			<div
				id="topbar"
				bind:this={topbar}
				class="fixed z-50 flex h-16 w-full items-center px-4 md:w-[calc(100vw-20rem)] md:px-8"
			>
				<!-- topbar backround -->
				<div
					class="absolute left-0 top-0 -z-10 h-full w-full bg-gradient-to-b from-transparent to-black/20"
					style:background-color={$page.data.color ?? 'rgb(0, 0, 0)'}
					style:opacity={`${headerOpacity}`}
				/>

				<Header {userAllPlaylists} />
			</div>
		{/if}

		<!-- main content -->
		<main
			id="main-content"
			class:logged-in={user}
			class={cn('px-4 pb-14 pt-8 md:px-8', user && 'pt-16')}
		>
			<slot />
		</main>
	</div>
</div>

<style lang="postcss">
	/* styles for when js is disabled */
	:global(html.no-js) #main {
		@apply block md:flex;
	}

	:global(html.no-js) #topbar {
		@apply sticky top-0 h-auto bg-header px-5 py-2.5;
	}

	:global(html.no-js) .logged-in {
		@apply pt-8;
	}
</style>
