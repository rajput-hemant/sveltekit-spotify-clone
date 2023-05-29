<script lang="ts">
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Element = $$Generic<'button' | 'a'>;

	type ButtonElements = {
		button: Omit<HTMLButtonAttributes, 'class'>;
		a: Omit<HTMLAnchorAttributes, 'class'>;
	};

	type $$Props = ButtonElements[Element] & {
		element: Element;
		variant?: 'solid' | 'outline' | 'danger';
		className?: string;
	};

	export let element: Element;
	export let variant: 'solid' | 'outline' | 'danger' = 'solid';
	export let className = '';

	let node: HTMLAreaElement | HTMLButtonElement;

	export const focus = () => {
		node.focus();
	};
</script>

<svelte:element
	this={element}
	class={cn(
		'inline-flex cursor-pointer rounded-3xl border-2 border-transparent px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50',
		{
			'bg-accent text-background hover:bg-accent/75': variant === 'solid',
			'border-light-gray bg-transparent text-white hover:bg-medium-gray': variant === 'outline',
			'bg-error hover:bg-error/75': variant === 'danger'
		},
		className
	)}
	on:click
	{...$$restProps}
>
	<slot />
</svelte:element>
