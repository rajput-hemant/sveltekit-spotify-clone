<script lang="ts">
	import Button from '$components/Button.svelte';
</script>

<!-- wrapper -->
<div class="mx-auto mt-20 flex w-full max-w-7xl flex-col items-center lg:flex-row">
	<!-- content -->
	<div class="flex-[1.8]">
		<!-- logo -->
		<img src="/assets/spotify-logo.png" alt="Spotify Logo" class="mb-8 w-44 max-w-full" />

		<h1 class="text-[2.5rem]">INR 0.00 for 3 months of Premium</h1>
		<p class="text-xl">Enjoy ad-free music listening, Offline plyback, and more. Cancel anytime.</p>

		<!-- buttons -->
		<div class="mt-10 space-x-2 uppercase">
			<Button
				element="a"
				variant="outline"
				href="https://www.spotify.com/"
				target="_blank"
				rel="noopener noreferer"
			>
				Sign Up
			</Button>

			<Button element="a" href="/api/auth/login">Login</Button>
		</div>
	</div>

	<!-- cover -->
	<div class="mt-10 flex-1 lg:mr-5 lg:mt-0">
		<img src="/assets/cover.png" alt="Svelte Spotify Cover" class="max-w-full" />
	</div>
</div>
