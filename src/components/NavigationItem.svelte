<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import type { Icon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

	export let item: {
		path: string;
		label: string;
		icon: ComponentType<Icon>;
	};
	export let ref: HTMLElement | undefined = undefined;
	export let onKeyDown: ((e: KeyboardEvent) => void) | undefined = undefined;
</script>

<a
	href={item.path}
	bind:this={ref}
	on:keypress={onKeyDown}
	class={cn(
		'my-2.5 flex items-center gap-3 p-1.5 text-sm font-medium text-text transition-opacity duration-200 hover:opacity-100 focus:opacity-100',
		item.path !== $page.url.pathname && 'opacity-70'
	)}
>
	<svelte:component
		this={item.icon}
		focusable="false"
		aria-hidden="true"
		strokeWidth="1.5"
		class="h-6 w-6 text-text"
	/>

	{item.label}
</a>
