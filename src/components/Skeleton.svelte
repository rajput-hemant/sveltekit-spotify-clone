<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = {
		className?: string;
	} & Omit<HTMLAttributes<HTMLDivElement>, 'class'>;

	export let className = '';
</script>

<div class={cn('animate-pulse rounded-md bg-white/10', className)} {...$$restProps} />
