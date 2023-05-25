<script lang="ts">
	import { invalidateAll } from '$app/navigation';

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
	<button
		class="bg-medium-gray p-2 rounded-md px-4 text-lg hover:bg-zinc-800 active:translate-y-0.5"
	>
		Logout
	</button>
</form>
