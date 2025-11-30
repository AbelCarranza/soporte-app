import { writable } from 'svelte/store';
import type { ReportanteData } from '$lib/types/ReportanteData';

function safeParseReportante(data: string | null): ReportanteData {
  try {
    return data ? JSON.parse(data) as ReportanteData : {};
  } catch {
    return {};
  }
}

const stored = typeof window !== 'undefined'
  ? localStorage.getItem('reportanteData')
  : null;

const initialData: ReportanteData = safeParseReportante(stored);

export const reportanteStore = writable<ReportanteData>(initialData);

if (typeof window !== 'undefined') {
  reportanteStore.subscribe((data) => {
    localStorage.setItem('reportanteData', JSON.stringify(data));
  });
}
