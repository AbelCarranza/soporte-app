import { writable } from 'svelte/store';
import type { PerifericoData } from '$lib/types/PerifericoData';


const initialData: PerifericoData = {};


export const perifericoStore = writable<PerifericoData>(initialData);


if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('perifericoData');
  if (stored) perifericoStore.set(JSON.parse(stored));

  perifericoStore.subscribe((data) => {
    localStorage.setItem('perifericoData', JSON.stringify(data));
  });
}
