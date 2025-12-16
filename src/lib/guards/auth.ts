import { authStore } from '$lib/stores/auth.svelte';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

/**
 * Auth guard for protected routes
 * ใช้ใน load function ของ +layout.ts หรือ +page.ts
 *
 * @example
 * // src/routes/dashboard/+layout.ts
 * import { requireAuth } from '$lib/guards/auth';
 *
 * export const load = async () => {
 *   requireAuth();
 *   return {};
 * };
 */
export function requireAuth() {
	if (browser && !authStore.isAuthenticated) {
		throw redirect(302, '/login');
	}
}

/**
 * Redirect to home if already authenticated
 * ใช้สำหรับหน้า login/register เพื่อป้องกันการเข้าถึงเมื่อ login แล้ว
 *
 * @example
 * // src/routes/login/+page.ts
 * import { redirectIfAuthenticated } from '$lib/guards/auth';
 *
 * export const load = async () => {
 *   redirectIfAuthenticated();
 *   return {};
 * };
 */
export function redirectIfAuthenticated(redirectTo = '/') {
	if (browser && authStore.isAuthenticated) {
		throw redirect(302, redirectTo);
	}
}
