import { writable } from 'svelte/store';
import type { PerifericoData } from '$lib/types/PerifericoData';

function safeParsePeriferico(data: string | null): PerifericoData {
  try {
    return data ? JSON.parse(data) as PerifericoData : {};
  } catch {
    return {};
  }
}

const stored = typeof window !== 'undefined'
  ? localStorage.getItem('perifericoData')
  : null;

const initialData: PerifericoData = safeParsePeriferico(stored);

export const perifericoStore = writable<PerifericoData>(initialData);

if (typeof window !== 'undefined') {
  perifericoStore.subscribe((data) => {
    localStorage.setItem('perifericoData', JSON.stringify(data));
  });
}