import { get } from 'svelte/store';
import { notifyError } from '$lib/services/notyf';

import { reportStore } from '$lib/stores/reportStorage';
import { perifericoStore } from '$lib/stores/perifericoStore';
import { replacementStore } from '$lib/stores/replacementStorage';
import { backupPerifericoStore } from '$lib/stores/backupPerifericoStore';


export function validarPaso4(): boolean {
  const cpu = get(reportStore);
  const perif = get(perifericoStore);

  const cpuActivo = cpu?.showHardware ?? false;
  const perifActivo = perif
    ? Object.values({
        showMonitor: perif.showMonitor,
        showKeyboard: perif.showKeyboard,
        showMouse: perif.showMouse,
        showOthers: perif.showOthers
      }).some((v) => v)
    : false;

  if (!cpuActivo && !perifActivo) {
    notifyError('Debes completar al menos el CPU o algún periférico del equipo principal.');
    return false;
  }

  return true;
}


export function validarPaso6(): boolean {
  const cpu = get(reportStore);
  const perif = get(perifericoStore);
  const cpuBackup = get(replacementStore);
  const perifBackup = get(backupPerifericoStore);

  const cpuActivo = cpu?.showHardware ?? false;
  const perifActivo = perif
    ? Object.values({
        showMonitor: perif.showMonitor,
        showKeyboard: perif.showKeyboard,
        showMouse: perif.showMouse,
        showOthers: perif.showOthers
      }).some((v) => v)
    : false;

  const cpuBackupActivo = cpuBackup?.showReplacementHardware ?? false;
  const perifBackupActivo = perifBackup
    ? Object.values({
        showMonitor: perifBackup.showMonitor,
        showKeyboard: perifBackup.showKeyboard,
        showMouse: perifBackup.showMouse,
        showOthers: perifBackup.showOthers
      }).some((v) => v)
    : false;
  if (!(cpuActivo || perifActivo)) {
    notifyError('Debes completar al menos el CPU o algún periférico del equipo principal.');
    return false;
  }

  if (!(cpuBackupActivo || perifBackupActivo)) {
    notifyError('Debes completar al menos el CPU o algún periférico del equipo de reemplazo.');
    return false;
  }

  return true;
}
