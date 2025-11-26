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

  observations?: string;
}