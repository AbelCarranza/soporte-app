import { writable } from 'svelte/store';

function safeParseStep(data: string | null): number {
  const parsed = parseInt(data || '', 10);
  return isNaN(parsed) ? 1 : parsed;
}

const storedStep = typeof window !== 'undefined'
  ? localStorage.getItem('currentStep')
  : null;

export const stepStore = writable(safeParseStep(storedStep));

if (typeof window !== 'undefined') {
  stepStore.subscribe((step) => {
    localStorage.setItem('currentStep', step.toString());
  });
}