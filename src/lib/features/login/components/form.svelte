<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '../schema';
	import { toast } from 'svelte-sonner';
	import client from '$lib/api/client';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';

	const form = superForm(defaults(zod4(loginSchema)), {
		SPA: true,
		validators: zod4(loginSchema),
		resetForm: false,
		onUpdate: async ({ form }) => {
			if (form.valid) {
				try {
					console.log('Form is valid:', form.data);
					toast.success('Form is valid and ready to submit!');
					const { data, error } = await client.POST('/v1/auth/login', {
						body: {
							...form.data,
							platform: 'web'
						},
						credentials: 'include'
					});
					console.log('Login response:', { data, error });

					if (error) {
						const errorMessage = error.errors?.[0]?.msg || 'Unknown error';
						throw new Error('Login failed: ' + errorMessage);
					}

					if (!data) {
						throw new Error('No login data received');
					}

					reset();

					const me = await client.GET('/v1/users/me', {
						headers: {
							Authorization: `Bearer ${data.access_token}`
						}
					});
					console.log('Me response:', { me });

					if (!me.data) {
						throw new Error('Failed to retrieve user data');
					}

					authStore.login(data, {
						username: me.data.username,
						name: me.data.name,
						id: me.data.id,
						role: me.data.role,
						is_active: me.data.is_active,
						email: me.data.email,
						last_login_date: me.data.last_login_date,
						created_at: me.data.created_at
					});
					toast.success('Login successful!');

					// Redirect to home page
					await goto('/').catch(console.error);
				} catch (err) {
					console.error('Login error:', err);
					const message = err instanceof Error ? err.message : 'Login failed';
					toast.error(message);
					throw err; // Re-throw to let superForm know submission failed
				}
			} else {
				toast.error('Form not valid. Please check the fields.');
				throw new Error('Form validation failed');
			}
		}
	});
	const { form: formData, submitting, reset } = form;
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" use:form.enhance>
			<Field.FieldGroup>
				<Form.Field {form} name="username">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Username</Form.Label>
							<Input {...props} bind:value={$formData.username} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Password</Form.Label>
							<Input
								{...props}
								type="password"
								bind:value={$formData.password}
								placeholder="Enter your password"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button disabled={$submitting}>Login</Form.Button>
			</Field.FieldGroup>
		</form>
	</Card.Content>
</Card.Root>
