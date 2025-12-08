import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

let notyf: Notyf | null = null;

function getNotyf() {
  if (!notyf) {
    notyf = new Notyf({
      duration: 3000,
      position: { x: 'right', y: 'bottom' },
      ripple: true,
      dismissible: true,
      types: [
        {
          type: 'info',
          background: '#528eeeff',
          icon: false,
          duration: 4000,
        },
      ],
    });
  }
  return notyf;
}

export function notifySuccess(message: string) {
  getNotyf().success(message);
}

export function notifyError(message: string) {
  getNotyf().error(message);
}

export function notifyInfo(message: string) {
  getNotyf().open({
    type: 'info',
    message,
  });
}
