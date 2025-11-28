import { backupPerifericoStore } from './backupPerifericoStore';
import { decisionStore } from './decisionStore';
import { perifericoStore } from './perifericoStore';
import { replacementStore } from './replacementStorage';
import { reportanteStore } from './reportanteStore';
import { reportStore } from './reportStorage';
import { stepStore } from './stepStore';

import { initialReportData } from '$lib/constants/initialReportData';

export function resetAllStores() {
    console.log(initialReportData)
  backupPerifericoStore.set({});
  decisionStore.set({ selected_decision: '', action_plan: '', other_description: '' });
  perifericoStore.set({});
  replacementStore.set({});
  reportanteStore.set({});
  reportStore.set({ ...initialReportData });
  stepStore.set(1);
  
}