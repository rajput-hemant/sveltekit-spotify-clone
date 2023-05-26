<script lang="ts">
	import '@fontsource/metropolis/400.css';
	import '@fontsource/metropolis/500.css';
	import '@fontsource/metropolis/600.css';
	import '@fontsource/metropolis/700.css';

	import '$styles/tippy-theme.css';
	import 'nprogress/nprogress.css';
	import '../app.css';

	import NProgress from 'nprogress';
	import { hideAll } from 'tippy.js';
	import { page } from '$app/stores';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import Header from '$components/Header.svelte';
	import Navigation from '$components/Navigation.svelte';
	import { cn } from '$lib/utils';
	import type { LayoutData } from './$types';

	NProgress.configure({ showSpinner: false });

	export let data: LayoutData;

	$: user = data.user;

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

{#if user}
	<a
		href="#main-content"
		class="sr-only left-2 top-2 z-50 bg-accent p-2 font-medium text-white focus:not-sr-only focus:absolute"
		>Skip to Content</a
	>
{/if}

<!-- main -->
<div class="flex">
	{#if user}
		<aside>
			<Navigation desktop={true} />
		</aside>
	{/if}
	<!-- content -->
	<div class="flex-1">
		<!-- topbar -->
		{#if user}
			<div
				bind:this={topbar}
				class="fixed z-50 flex h-16 w-full items-center px-4 md:w-[calc(100vw-16rem)] md:px-8"
			>
				<div
					class="absolute left-0 top-0 -z-10 h-full w-full bg-header"
					style:opacity={`${headerOpacity}`}
				/>
				<Header />
			</div>
		{/if}

		<!-- main content -->
		<main id="main-content" class={cn('px-4 pb-14 pt-8 md:px-8', user && 'p-16')}>
			<slot />
		</main>
	</div>
</div>
