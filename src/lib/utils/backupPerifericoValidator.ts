import { notifyError } from '../services/notyf';

const allowedRegex = /^[A-Za-z0-9\- ]+$/;

export function validateBackupPerifericos(state: any): boolean {
	const {
		showMonitor,
		showKeyboard,
		showMouse,
		showOthers,
		bk_monitor,
		bk_mon_code,
		bk_mon_serial,
		bk_keyboard,
		bk_key_code,
		bk_key_serial,
		bk_mouse,
		bk_mouse_code,
		bk_mouse_serial,
		bk_obs
	} = state;

	if (!showMonitor && !showKeyboard && !showMouse && !showOthers) {
		notifyError('Debe seleccionar al menos un periférico o ingresar observaciones.');
		return false;
	}

	if (showMonitor) {
		if (!validateFields({
			bk_monitor,
			bk_mon_code,
			bk_mon_serial
		}, 'Monitor')) return false;
	}

	if (showKeyboard) {
		if (!validateFields({
			bk_keyboard,
			bk_key_code,
			bk_key_serial
		}, 'Teclado')) return false;
	}

	if (showMouse) {
		if (!validateFields({
			bk_mouse,
			bk_mouse_code,
			bk_mouse_serial
		}, 'Mouse')) return false;
	}

	state.bk_obs = String(bk_obs ?? '').trim();
	return true;
}

function validateFields(fields: Record<string, any>, sectionName: string): boolean {
	for (const [key, value] of Object.entries(fields)) {
		const trimmed = String(value ?? '').trim();

		if (!trimmed) {
			notifyError(`El campo "${sectionName} - ${labelKey(key)}" debe estar completo.`);
			return false;
		}

		if (!allowedRegex.test(trimmed)) {
			notifyError(
				`"${sectionName} - ${labelKey(key)}" contiene caracteres inválidos. Solo se permite letras, números, espacios y "-".`
			);
			return false;
		}

		fields[key] = trimmed;
	}
	return true;
}

function labelKey(key: string): string {
	const map: Record<string, string> = {
		bk_monitor: 'Marca y/o Modelo',
		bk_mon_code: 'Código',
		bk_mon_serial: 'Número de Serie',

		bk_keyboard: 'Marca y/o Modelo',
		bk_key_code: 'Código',
		bk_key_serial: 'Número de Serie',

		bk_mouse: 'Marca y/o Modelo',
		bk_mouse_code: 'Código',
		bk_mouse_serial: 'Número de Serie'
	};
	return map[key] ?? key;
}
