import { writable } from 'svelte/store';

export interface ReportanteData {
  reported_by?: string;
  location?: string;
  technician?: string;
  issue_date?: string;
}


const initialData: ReportanteData = {};

export const reportanteStore = writable<ReportanteData>(initialData);


if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('reportanteData');
  if (stored) reportanteStore.set(JSON.parse(stored));

  reportanteStore.subscribe((data) => {
    localStorage.setItem('reportanteData', JSON.stringify(data));
  });
}
