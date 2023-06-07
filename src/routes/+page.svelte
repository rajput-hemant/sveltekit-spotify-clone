<script lang="ts">
	import Button from '$components/Button.svelte';
	import Card from '$components/Card.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let sections: {
		title: string;
		path: string;
		items: (SpotifyApi.AlbumObjectSimplified | SpotifyApi.PlaylistObjectSimplified)[];
	}[] = [];

	$: {
		if (data.newReleases) {
			sections.push({
				title: 'New Releases',
				path: '/section/new-releases',
				items: data.newReleases.albums.items
			});
		}

		if (data.featuredPlaylists) {
			sections.push({
				title: 'Featured Playlists',
				path: '/section/featured-playlists',
				items: data.featuredPlaylists.playlists.items
			});
		}

		data.homeCategories.forEach((category, i) => {
			const categoryPlaylist = data.categoriesPlaylists[i];

			if (categoryPlaylist) {
				sections.push({
					title: category.name,
					path: `/section/categories/${category.id}`,
					items: categoryPlaylist.playlists.items
				});
			}
		});

		if (data.userPlaylists) {
			sections.push({
				title: 'Your Playlists',
				path: '/section/playlists',
				items: data.userPlaylists.items
			});
		}
	}
</script>

{#each sections as section}
	<!-- content row -->
	<section class="mb-5">
		<!-- content row header -->
		<div class="mb-5 flex items-center justify-between">
			<!-- right -->
			<div>
				<!-- section title -->
				<h2 class="text-2xl font-semibold">{section.title}</h2>
			</div>

			<!-- left -->
			<div>
				<Button element="a" variant="outline" href={section.path}>
					See All
					<span class="sr-only">
						{section.title}
					</span>
				</Button>
			</div>
		</div>

		<!-- grid items -->
		<div class="grid-items">
			{#each section.items as item}
				<!-- grid item -->
				<div>
					<Card {item} />
				</div>
			{/each}
		</div>
	</section>
{/each}
