<script lang="ts">
	import { Music } from 'lucide-svelte';
	import Skeleton from './Skeleton.svelte';

	export let title: string,
		color: string | null,
		image: string | undefined,
		type: string | undefined;
</script>

<!-- banner -->

<div
	class="relative -mx-[30px] -mt-[calc(30px+2rem)] flex flex-col px-8 pb-5 pt-[calc(30px+2rem)] sm:flex-row sm:items-end"
>
	<!-- banner gradient -->
	<div
		style:background-image="linear-gradient(0deg, transparent, {color || 'rgb(167, 167, 167)'})"
		class="absolute left-0 top-0 -z-10 h-[150%] w-full"
	/>

	<!-- cover -->
	<div class="mb-8 sm:mb-0 sm:mr-8">
		{#if image}
			<div class="relative aspect-square shadow-md shadow-black sm:w-64 md:w-52 lg:w-64">
				<img src={image} alt={title} class="w-full object-cover" />

				<Skeleton className="absolute inset-0 -z-10" />
			</div>
		{:else}
			<!-- cover placeholder -->
			<div
				class="flex aspect-square w-full items-center justify-center bg-medium-gray shadow-md shadow-black sm:w-64 md:w-52 lg:w-64"
			>
				<Music focusable="false" aria-hidden={true} class="h-2/5 w-2/5 text-light-gray" />
			</div>
		{/if}
	</div>

	<!-- info -->
	<div>
		{#if type}
			<p class="text-xs font-semibold uppercase">{type}</p>
		{/if}

		<h1 class="text-3xl font-semibold md:text-4xl lg:text-5xl">{title}</h1>

		<slot name="meta" />
	</div>
</div>

<!-- content -->
<div class="relative z-10 -mx-8 min-h-[300px] bg-gradient-to-b from-black/10 to-background p-8">
	<slot />
</div>
