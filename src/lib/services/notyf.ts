import { Notyf } from 'notyf';

let notyf: Notyf | null = null;

function getNotyf() {
  if (!notyf) {
    notyf = new Notyf({
      duration: 3000,
      position: { x: 'right', y: 'top' },
      ripple: true,
      dismissible: true,
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
