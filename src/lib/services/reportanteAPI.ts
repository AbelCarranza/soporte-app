export async function getReportantes(): Promise<string[]> {
	try {
		const response = await fetch(
			'https://script.google.com/macros/s/AKfycbwHlyZmiAQ6Cdgoa-YRQLUBcIeH_clWjGLKT9Na1DcnrNvfEHw6WFXR0IachIPjP7ceIg/exec?sheet=Personal',
			{ credentials: 'omit' }
		);

		const data = await response.json();

		let reportantesSimulados: string[] = [];

		if (Array.isArray(data)) {
			reportantesSimulados = data.map((item: any) => item.psr).filter(Boolean);
		}

		return reportantesSimulados;
	} catch (error) {
		console.error('Error obteniendo reportantes:', error);
		return [];
	}
}

export async function addReportante(nombre: string): Promise<void> {

	const body = new URLSearchParams({ psr: nombre });

	const url =
		'https://script.google.com/macros/s/AKfycbwHlyZmiAQ6Cdgoa-YRQLUBcIeH_clWjGLKT9Na1DcnrNvfEHw6WFXR0IachIPjP7ceIg/exec?sheet=Personal';

	const res = await fetch(url, {
		method: 'POST',
		body: body
	});

	const data = await res.json();
	console.log('Respuesta de Apps Script:', data);

}
