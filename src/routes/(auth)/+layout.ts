import { requireAuth } from '$lib/guards/auth';
import type { LayoutLoad } from './$types';

export const load = (async () => {
	requireAuth();
	return {};
}) satisfies LayoutLoad;
