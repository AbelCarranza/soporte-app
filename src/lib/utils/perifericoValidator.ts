import { notifyError } from '../services/notyf';

const allowedRegex = /^[A-Za-z0-9\- ]+$/;

/**
 * Valida los campos de periféricos.
 * @param state estado actual con los showX y los valores de los campos
 * @returns boolean (true si pasa validación, false si falla)
 */
export function validatePerifericos(state: any): boolean {
	const { showMonitor, showKeyboard, showMouse, monitor_brand, monitor_code, monitor_serial,
			keyboard_brand, keyboard_code, keyboard_serial, mouse_brand, mouse_code, mouse_serial,
			observations } = state;

	// Verifica si al menos un checkbox está activo
	if (!showMonitor && !showKeyboard && !showMouse && !state.showOthers) {
		notifyError('Debe seleccionar al menos un periférico o ingresar observaciones.');
		return false;
	}

	// Validación por sección
	if (showMonitor) {
		if (!validateFields({ monitor_brand, monitor_code, monitor_serial }, 'Monitor')) return false;
	}
	if (showKeyboard) {
		if (!validateFields({ keyboard_brand, keyboard_code, keyboard_serial }, 'Teclado')) return false;
	}
	if (showMouse) {
		if (!validateFields({ mouse_brand, mouse_code, mouse_serial }, 'Mouse')) return false;
	}

	// Observaciones no son obligatorias, solo se limpia o mantiene
	state.observations = String(observations ?? '').trim();

	return true;
}

// Función genérica para validar un conjunto de campos
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

// Traduce nombres de campos internos a etiquetas en español
function labelKey(key: string): string {
	const map: Record<string, string> = {
		monitor_brand: 'Marca y/o Modelo',
		monitor_code: 'Código',
		monitor_serial: 'Número de Serie',
		keyboard_brand: 'Marca y/o Modelo',
		keyboard_code: 'Código',
		keyboard_serial: 'Número de Serie',
		mouse_brand: 'Marca y/o Modelo',
		mouse_code: 'Código',
		mouse_serial: 'Número de Serie'
	};
	return map[key] ?? key;
}