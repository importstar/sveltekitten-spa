<script>
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';

	// Placeholder data - user will replace with real logic
	let servers = [
		{
			name: 'API Server 1',
			status: 'online',
			responseTime: '120ms',
			lastChecked: '2024-01-05 10:00:00'
		},
		{
			name: 'API Server 2',
			status: 'offline',
			responseTime: 'N/A',
			lastChecked: '2024-01-05 09:55:00'
		},
		{
			name: 'Database Server',
			status: 'online',
			responseTime: '45ms',
			lastChecked: '2024-01-05 10:00:00'
		},
		{
			name: 'Cache Server',
			status: 'online',
			responseTime: '15ms',
			lastChecked: '2024-01-05 10:00:00'
		}
	];

	let isLoading = false; // Set to true when checking status
</script>

<div class="container mx-auto p-6">
	<h1 class="mb-6 text-3xl font-bold">API Server Status</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each servers as server (server.name)}
			<Card class="w-full">
				<CardHeader>
					<CardTitle class="flex items-center justify-between">
						{server.name}
						<div class="flex items-center space-x-2">
							<div
								class="h-3 w-3 rounded-full {server.status === 'online'
									? 'bg-green-500'
									: 'bg-red-500'}"
							></div>
							<span class="text-sm capitalize">{server.status}</span>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{#if isLoading}
						<Skeleton class="mb-2 h-4 w-20" />
						<Skeleton class="h-4 w-32" />
					{:else}
						<div class="space-y-2">
							<div class="flex justify-between">
								<span class="text-sm text-gray-600">Response Time:</span>
								<span class="text-sm font-medium">{server.responseTime}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-sm text-gray-600">Last Checked:</span>
								<span class="text-sm font-medium">{server.lastChecked}</span>
							</div>
						</div>
					{/if}
				</CardContent>
			</Card>
		{/each}
	</div>
</div>
