<script>
	import { useHealthStatus } from '$lib/features/health/queries';

	const healthQuery = useHealthStatus();
</script>

<div class="container mx-auto p-6">
	<h1 class="mb-6 text-3xl font-bold">API Server Status</h1>
	{#if healthQuery.isLoading}
		<p>Checking system...</p>
	{:else if healthQuery.isError}
		<p style="color: red;">System Down: {healthQuery.error.message}</p>
	{:else if healthQuery.data}
		<p style="color: green;">
			Status: {healthQuery.data.status}
		</p>
	{/if}
</div>
