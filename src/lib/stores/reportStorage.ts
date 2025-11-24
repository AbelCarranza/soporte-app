import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { ReportData } from '$lib/types/report';
import { initialReportData } from '$lib/constants/initialReportData';

let initial: ReportData = { ...initialReportData };

if (browser) {
  const stored = localStorage.getItem('reportData');
  if (stored) initial = JSON.parse(stored);
}

export const reportStore = writable<ReportData>(initial);

if (browser) {
  reportStore.subscribe((data) => {
    localStorage.setItem('reportData', JSON.stringify(data));
  });
}
