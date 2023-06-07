<script lang="ts">
	import { ChevronDown, ExternalLink } from 'lucide-svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { tippy } from '$actions';
	import Navigation from './Navigation.svelte';
	import Skeleton from './Skeleton.svelte';
	import Logout from './Logout.svelte';
	import SearchForm from './SearchForm.svelte';
	import HeaderNav from './HeaderNav.svelte';

	export let userAllPlaylists: SpotifyApi.PlaylistObjectSimplified[] | undefined;

	$: user = $page.data.user;
</script>

<!-- container -->
<div class="content flex w-full items-center justify-between">
	<!-- left -->
	<div>
		{#if browser}
			<Navigation desktop={false} {userAllPlaylists} />
		{/if}

		<HeaderNav />

		{#if $page.url.pathname.startsWith('/search')}
			<div class="search-form ml-5 hidden lg:block">
				<SearchForm />
			</div>
		{/if}
	</div>

	<!-- right -->
	<div>
		<!-- profile buttom -->
		<button
			id="profile-button"
			title={user?.display_name ?? 'Profile'}
			use:tippy={{
				content: document.getElementById('profile-menu') || undefined,
				onMount: () => {
					const template = document.getElementById('profile-menu');
					if (template) {
						template.style.display = 'block';
					}
				},
				trigger: 'click',
				placement: 'bottom-end',
				interactive: true,
				theme: 'menu'
				// hideOnPopperBlur: false,
			}}
			class="flex cursor-pointer items-center rounded-3xl border border-white/20 p-1 text-text hover:bg-accent"
		>
			<div class="relative mr-2 h-9 w-9 overflow-hidden rounded-full">
				{#if user?.images && user.images?.length > 0}
					<img src={user?.images[0].url} alt="" class="object-cover" />
				{/if}

				<Skeleton className="-z-10 absolute inset-0" />
			</div>

			{user?.display_name}
			<span class="sr-only">Profile Menu</span>

			<ChevronDown class="ml-1 h-5 w-5" />
		</button>

		<!-- profile menu -->
		<div id="profile-menu" class="hidden">
			<!-- profile menu content -->
			<ul class="flex flex-col gap-1 p-2">
				<li class="flex h-10 items-center hover:bg-white/10">
					<a
						href={user?.external_urls.spotify}
						class="flex w-full items-center gap-3 px-4 py-2 text-menu-text"
					>
						View on Spotify

						<ExternalLink focusable="false" aria-hidden size={20} class="mr-1" />
					</a>
				</li>

				<li class="flex h-10 items-center hover:bg-white/10">
					<a href="/profile" class="w-full px-4 py-2 text-menu-text">View Profile</a>
				</li>

				<li class="flex h-10 items-center border-t border-white/10 hover:bg-white/10">
					<Logout
						className="bg-transparent block w-full font-normal hover:bg-transparent text-menu-text py-2 text-left px-4"
					/>
				</li>
			</ul>
		</div>
	</div>
</div>

<style lang="postcss">
	/* styles for when js is disabled */
	:global(html.no-js) #profile-button {
		@apply hidden;
	}

	:global(html.no-js) #profile-menu {
		@apply block;
	}
	:global(html.no-js) #profile-menu > ul {
		@apply m-0 flex flex-row p-0;
	}

	:global(html.no-js) .content {
		@apply justify-start md:justify-between;
	}

	:global(html.no-js) .search-form {
		margin-left: 0px;
	}
</style>
