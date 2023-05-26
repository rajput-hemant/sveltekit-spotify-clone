<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Button from './Button.svelte';

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
	<Button>Logout</Button>
</form>
