import { browser } from '$app/environment';
import type { components } from '$lib/api/paths/fastapi';

type Token = components['schemas']['Token'];

interface User {
	username: string;
	// เพิ่มข้อมูล user อื่นๆ ตามที่ backend ส่งมา
}

interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	tokenType: string | null;
	expiresIn: number | null;
	isAuthenticated: boolean;
}

class AuthStore {
	private state = $state<AuthState>({
		user: null,
		accessToken: null,
		refreshToken: null,
		tokenType: null,
		expiresIn: null,
		isAuthenticated: false
	});

	constructor() {
		if (browser) {
			this.loadFromStorage();
		}
	}

	get user() {
		return this.state.user;
	}
	get accessToken() {
		return this.state.accessToken;
	}
	get refreshToken() {
		return this.state.refreshToken;
	}
	get tokenType() {
		return this.state.tokenType;
	}
	get expiresIn() {
		return this.state.expiresIn;
	}
	get isAuthenticated() {
		return this.state.isAuthenticated;
	}

	login(tokens: Token, user: User) {
		this.state = {
			user,
			accessToken: tokens.access_token,
			refreshToken: tokens.refresh_token,
			tokenType: tokens.token_type,
			expiresIn: tokens.expires_in,
			isAuthenticated: true
		};
		this.saveToStorage();
	}

	updateTokens(tokens: Token) {
		this.state.accessToken = tokens.access_token;
		this.state.refreshToken = tokens.refresh_token;
		this.state.tokenType = tokens.token_type;
		this.state.expiresIn = tokens.expires_in;
		this.saveToStorage();
	}

	logout() {
		this.state = {
			user: null,
			accessToken: null,
			refreshToken: null,
			tokenType: null,
			expiresIn: null,
			isAuthenticated: false
		};
		if (browser) {
			localStorage.removeItem('auth');
		}
	}

	isTokenExpired(): boolean {
		if (!this.state.expiresIn) return true;
		return new Date(this.state.expiresIn) <= new Date();
	}

	private saveToStorage() {
		if (browser) {
			localStorage.setItem('auth', JSON.stringify(this.state));
		}
	}

	private loadFromStorage() {
		const stored = localStorage.getItem('auth');
		if (stored) {
			try {
				this.state = JSON.parse(stored);
			} catch (e) {
				console.error('Failed to parse auth state from localStorage', e);
				localStorage.removeItem('auth');
			}
		}
	}
}

export const authStore = new AuthStore();
