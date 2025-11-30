import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { ReportData } from '$lib/types/report';
import { initialReportData } from '$lib/constants/initialReportData';

function safeParseReport(data: string | null): ReportData {
  try {
    return data ? JSON.parse(data) as ReportData : { ...initialReportData };
  } catch {
    return { ...initialReportData };
  }
}

const stored = browser ? localStorage.getItem('reportData') : null;

const initial: ReportData = safeParseReport(stored);

export const reportStore = writable<ReportData>(initial);

if (browser) {
  reportStore.subscribe((data) => {
    localStorage.setItem('reportData', JSON.stringify(data));
  });
}
