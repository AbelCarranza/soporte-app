const textOnlyRegex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]+$/;
const locationRegex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ .,]+$/;

export function cleanText(value: any): string {
	return String(value ?? '')
		.replace(/\s+/g, ' ')
		.trim();
}

export function hasInvalidSymbols(value: string, isLocation = false): boolean {
	const regex = isLocation ? locationRegex : textOnlyRegex;
	return !regex.test(value);
}