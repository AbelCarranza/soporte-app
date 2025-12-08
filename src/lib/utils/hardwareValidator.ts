import { notifyError } from '../services/notyf';

const defaultRegex = /^[A-Za-z0-9\- ]+$/;
const speedRegex = /^[0-9]+(\.[0-9]+)?\s*[a-zA-Z]*$/;
const serialRegex = /^[A-Za-z0-9.]+$/;

export function validateHardware(showHardware: boolean, fields: any): boolean {
	if (!showHardware) return true;

	const entries = Object.entries(fields);

	for (const [key, value] of entries) {
		const trimmed = String(value ?? '').trim();

		if (!trimmed) {
			notifyError(`El campo "${translateKey(key)}" debe estar completo.`);
			return false;
		}

		const regex =
			key === 'speed' || key === 'bk_speed'
				? speedRegex
				: key === 'serial' || key === 'bk_serial'
					? serialRegex
					: defaultRegex;

		if (!regex.test(trimmed)) {
			notifyError(`"${translateKey(key)}" contiene caracteres inválidos.`);
			return false;
		}

		fields[key] = trimmed;
	}

	return true;
}

function translateKey(key: string): string {
	const map: Record<string, string> = {
		brand: 'Marca',
		asset_code: 'Código Patrimonial',
		serial: 'Número de Serie',
		plate: 'Placa',
		cpu: 'Procesador',
		speed: 'Velocidad del CPU',
		ram: 'Memoria RAM',
		hdd_brand: 'Marca del Disco',
		hdd_capacity: 'Capacidad del Disco',
		hdd_technology: 'Tecnología del Disco'
	};

	if (key.startsWith('bk_')) {
		const suffixMap: Record<string, string> = {
			brand: 'Marca',
			asset: 'Código Patrimonial',
			serial: 'Número de Serie',
			plate: 'Placa',
			cpu: 'Procesador',
			speed: 'Velocidad del CPU',
			ram: 'Memoria RAM',
			hdbrand: 'Marca del Disco',
			hdd_cap: 'Capacidad del Disco',
			hdd_tech: 'Tecnología del Disco'
		};

		const realKey = key.slice(3);
		const translated = suffixMap[realKey] ?? realKey;
		return translated;
	}

	return map[key] ?? key;
}
