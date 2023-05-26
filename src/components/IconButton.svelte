<script lang="ts">
	import type { Icon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type $$Props = {
		icon: ComponentType<Icon>;
		label: string;
	} & HTMLButtonAttributes;

	export let icon: ComponentType<Icon>;
	export let label: string;

	let button: HTMLButtonElement;
	export const getButton = () => button;
</script>

<button bind:this={button} on:click on:mouseover on:focus on:keydown {...$$restProps}>
	<svelte:component
		this={icon}
		class="align-middle text-text"
		aria-hidden="true"
		focusable="false"
	/>

	<span class="sr-only">{label}</span>
</button>

<style>
	button {
		width: 2.25rem;
		height: 2.25rem;
	}

	button:active {
		background-color: var(--menu-bg);
	}

	button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
