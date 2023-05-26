<script>
	import { browser } from '$app/environment';
	import Navigation from './Navigation.svelte';
</script>

<!-- container -->
<div class="flex w-full items-center justify-between">
	<!-- left -->
	<div class="">
		{#if browser}
			<Navigation desktop={false} />
		{/if}
	</div>

	<!-- right -->
	<div class="">Right</div>
</div>
