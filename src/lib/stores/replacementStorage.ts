import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { ReplacementData } from '$lib/types/ReplacementData';


const initial: ReplacementData = {};

export const replacementStore = writable<ReplacementData>(initial);

if (browser) {
  const stored = localStorage.getItem('replacementData');
  if (stored) replacementStore.set(JSON.parse(stored));

  replacementStore.subscribe((data) => {
    localStorage.setItem('replacementData', JSON.stringify(data));
  });
}