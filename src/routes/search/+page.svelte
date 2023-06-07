<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: items = data.categories?.categories.items;
</script>

{#if items}
	<h2 class="mb-5">Browse Categories</h2>

	<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7">
		{#each items as item}
			<div class="group relative overflow-hidden shadow-md shadow-black">
				<a href="/category/{item.id}">
					{#if item.icons.length > 0}
						<img
							src={item.icons[0].url}
							alt=""
							class="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					{/if}

					<span
						class="absolute bottom-5 line-clamp-1 w-full px-3 text-center font-bold text-text xl:text-xl"
					>
						{item.name}
					</span>
				</a>
			</div>
		{/each}
	</div>
{/if}
