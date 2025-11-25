import { writable } from 'svelte/store';

type DecisionData = {
  selected_decision: string;
  action_plan: string;
  other_description: string;
};

const stored = typeof window !== 'undefined' ? localStorage.getItem('decisionData') : null;

export const decisionStore = writable<DecisionData>(
  stored ? JSON.parse(stored) : { selected_decision: '', action_plan: '', other_description: '' }
);

if (typeof window !== 'undefined') {
  decisionStore.subscribe((data) => {
    localStorage.setItem('decisionData', JSON.stringify(data));
  });
}
