<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Button from './Button.svelte';

	export let className = '';

	const logoutHandler = async () => {
		const response = await fetch('/api/auth/logout', {
			method: 'POST',
			headers: {
				accept: 'application/json'
			},
			body: JSON.stringify({})
		});

		// Invalidate all pages
		if (response.ok) {
			invalidateAll();
		}
	};
</script>

<form method="post" action="/api/auth/logout" on:submit|preventDefault={logoutHandler}>
	<Button element="button" {className}>Logout</Button>
</form>
