<script lang="ts">
	import '@fontsource/metropolis/400.css';
	import '@fontsource/metropolis/500.css';
	import '@fontsource/metropolis/600.css';
	import '@fontsource/metropolis/700.css';

	import '../app.css';

	// import type { LayoutData } from './$types';

	// export let data: LayoutData;

	// $: user = data.user;
</script>

<!-- main -->
<div class="">
	<!-- content -->
	<div class="">
		<!-- main content -->
		<div class="px-4 pb-14 pt-8 md:px-8">
			<slot />
		</div>
	</div>
</div>
