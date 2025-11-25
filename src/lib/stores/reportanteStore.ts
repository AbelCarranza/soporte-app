import { writable } from 'svelte/store';
import type { ReportanteData } from '$lib/types/ReportanteData';



const initialData: ReportanteData = {};

export const reportanteStore = writable<ReportanteData>(initialData);


if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('reportanteData');
  if (stored) reportanteStore.set(JSON.parse(stored));

  reportanteStore.subscribe((data) => {
    localStorage.setItem('reportanteData', JSON.stringify(data));
  });
}
