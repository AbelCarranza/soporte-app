import { writable } from 'svelte/store';
import type { BackupPerifericoData } from '$lib/types/BackupPerifericoData';

function safeParseBackupPeriferico(data: string | null): BackupPerifericoData {
  try {
    return data ? JSON.parse(data) as BackupPerifericoData : {};
  } catch {
    return {};
  }
}

const stored = typeof window !== 'undefined'
  ? localStorage.getItem('backupPerifericoData')
  : null;

const initialData: BackupPerifericoData = safeParseBackupPeriferico(stored);

export const backupPerifericoStore = writable<BackupPerifericoData>(initialData);

if (typeof window !== 'undefined') {
  backupPerifericoStore.subscribe((data) => {
    localStorage.setItem('backupPerifericoData', JSON.stringify(data));
  });
}