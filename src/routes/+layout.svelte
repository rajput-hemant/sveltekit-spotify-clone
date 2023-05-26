<script lang="ts">
	import '@fontsource/metropolis/400.css';
	import '@fontsource/metropolis/500.css';
	import '@fontsource/metropolis/600.css';
	import '@fontsource/metropolis/700.css';

	import '../app.css';

	import type { LayoutData } from './$types';
	import Navigation from '$components/Navigation.svelte';
	import { cn } from '$lib/utils';
	import Header from '$components/Header.svelte';

	export let data: LayoutData;

	$: user = data.user;

	let topbar: HTMLElement;
	let scrollY: number;
	let headerOpacity = 0;

	$: if (topbar) {
		headerOpacity = scrollY / topbar.offsetHeight < 1 ? scrollY / topbar.offsetHeight : 1;
	}
</script>

<svelte:window bind:scrollY />

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

		<!-- main content -->
		<main class={cn('px-4 pb-14 pt-8 md:px-8', user && 'p-16')}>
			<slot />
		</main>
	</div>
</div>
