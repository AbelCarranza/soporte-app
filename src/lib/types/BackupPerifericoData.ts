export interface BackupPerifericoData {
  showMonitor?: boolean;
  showKeyboard?: boolean;
  showMouse?: boolean;
  showOthers?: boolean;

  bk_monitor?: string;
  bk_mon_code?: string;
  bk_mon_serial?: string;

  bk_keyboard?: string;
  bk_key_code?: string;
  bk_key_serial?: string;

  bk_mouse?: string;
  bk_mouse_code?: string;
  bk_mouse_serial?: string;

  bk_other_peripherals?: string;
}