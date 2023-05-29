<script lang="ts">
	import { cn } from '$lib/utils';
	import { toasts } from '$stores';
	import { X } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
</script>

{#if $toasts.length > 0}
	<!-- toasts -->
	<div class="overflow- fixed right-0 top-0 z-[999] max-h-screen w-full max-w-sm p-5">
		{#each $toasts as toast (toast.id)}
			<!-- toast -->
			<div
				transition:fly={{ x: 100, duration: 300 }}
				animate:flip={{ duration: 300 }}
				class={cn('relative mb-2.5 rounded bg-accent px-5 py-2.5 font-medium shadow-md', {
					'bg-error': toast.type === 'error',
					'bg-accent': toast.type === 'success',
					'bg-warning': toast.type === 'warning'
				})}
			>
				<div class="" role="status">{toast.message}</div>

				<!-- close button -->
				<button on:click={() => toasts.remove(toast.id)} class="absolute right-0 top-0 p-2.5">
					<X aria-hidden aria-label="Close Toast" focusable="false" class="h-5 w-5" />
				</button>
			</div>
		{/each}
	</div>
{/if}
