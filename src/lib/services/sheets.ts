export async function buscarEnSheets(tipoBusqueda: string, codigo: string) {
	const SCRIPT_URL =
		'https://script.google.com/macros/s/AKfycbwHlyZmiAQ6Cdgoa-YRQLUBcIeH_clWjGLKT9Na1DcnrNvfEHw6WFXR0IachIPjP7ceIg/exec?sheet=Inventario';

	const response = await fetch(SCRIPT_URL, { credentials: 'omit' });
	const data = await response.json();

	if (!Array.isArray(data)) return [];

	let filtrado = [];

	if (tipoBusqueda === '1') {
		const camposPatrimonio = ['AssetCode', 'KeyboardCode', 'MonitorCode', 'MouseCode'];

		filtrado = data
			.map((eq) => {
				const match = camposPatrimonio.find(
					(campo) => String(eq[campo]).trim() === String(codigo).trim()
				);
				return match ? { ...eq, matchField: match } : null;
			})
			.filter(Boolean);
	}

	else if (tipoBusqueda === '2') {
		const camposSerial = ['Serial', 'KeyboardSerial', 'MouseSerial', 'MonitorSerial'];

		filtrado = data
			.map((eq) => {
				const match = camposSerial.find((campo) => String(eq[campo]) === String(codigo));
				return match ? { ...eq, matchField: match } : null;
			})
			.filter(Boolean);
	}

	return filtrado;
}
