import { writable } from 'svelte/store';
import type  { BackupPerifericoData } from '$lib/types/BackupPerifericoData';

const initialData: BackupPerifericoData = {};

export const backupPerifericoStore = writable<BackupPerifericoData>(initialData);

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('backupPerifericoData');
  if (stored) backupPerifericoStore.set(JSON.parse(stored));

  backupPerifericoStore.subscribe((data) => {
    localStorage.setItem('backupPerifericoData', JSON.stringify(data));
  });
}
