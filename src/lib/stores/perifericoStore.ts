import { writable } from 'svelte/store';

export interface PerifericoData {
  showMonitor?: boolean;
  showKeyboard?: boolean;
  showMouse?: boolean;
  showOthers?: boolean;

  monitor_brand?: string;
  monitor_code?: string;
  monitor_serial?: string;

  keyboard_brand?: string;
  keyboard_code?: string;
  keyboard_serial?: string;

  mouse_brand?: string;
  mouse_code?: string;
  mouse_serial?: string;

  other_peripheral?: string;
}


const initialData: PerifericoData = {};


export const perifericoStore = writable<PerifericoData>(initialData);


if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('perifericoData');
  if (stored) perifericoStore.set(JSON.parse(stored));

  perifericoStore.subscribe((data) => {
    localStorage.setItem('perifericoData', JSON.stringify(data));
  });
}
