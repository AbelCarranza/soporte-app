
import { browser } from '$app/environment';

export function loadFromStorage(key: string, fallback: any) {
	if (!browser) return fallback;

	const saved = localStorage.getItem(key);
	if (!saved) return fallback;

	try {
		return JSON.parse(saved);
	} catch (e) {
		console.error("Error parseando localStorage", e);
		return fallback;
	}
}

export function saveToStorage(key: string, value: any) {
	if (!browser) return;
	localStorage.setItem(key, JSON.stringify(value));
}
