import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { ReplacementData } from '$lib/types/ReplacementData';

function safeParseReplacement(data: string | null): ReplacementData {
  try {
    return data ? JSON.parse(data) as ReplacementData : {};
  } catch {
    return {};
  }
}

const stored = browser ? localStorage.getItem('replacementData') : null;

const parsed = safeParseReplacement(stored);


const initial: ReplacementData = {
  showReplacementHardware: false,
  ...parsed
};

export const replacementStore = writable<ReplacementData>(initial);

if (browser) {
  replacementStore.subscribe((data) => {
    localStorage.setItem('replacementData', JSON.stringify(data));
  });
}