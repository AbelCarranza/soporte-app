import { writable } from 'svelte/store';

const storedStep = typeof window !== 'undefined' ? localStorage.getItem('currentStep') : null;

export const stepStore = writable(storedStep ? parseInt(storedStep) : 1);

if (typeof window !== 'undefined') {
  stepStore.subscribe((step) => {
    localStorage.setItem('currentStep', step.toString());
  });
}