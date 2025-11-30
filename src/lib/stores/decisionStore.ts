import { writable } from 'svelte/store';
import type { DecisionData } from '$lib/types/decision';

function safeParse(data: string | null): DecisionData {
  try {
    return data ? JSON.parse(data) as DecisionData : {
      selected_decision: '',
      action_plan: '',
      other_description: ''
    };
  } catch {
    return {
      selected_decision: '',
      action_plan: '',
      other_description: ''
    };
  }
}

const stored = typeof window !== 'undefined'
  ? localStorage.getItem('decisionData')
  : null;

export const decisionStore = writable<DecisionData>(safeParse(stored));

if (typeof window !== 'undefined') {
  decisionStore.subscribe((data) => {
    localStorage.setItem('decisionData', JSON.stringify(data));
  });
}
