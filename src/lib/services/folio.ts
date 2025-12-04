export async function getFolio(): Promise<number> {
	try {
		const response = await fetch(
			'https://script.google.com/macros/s/AKfycbwHlyZmiAQ6Cdgoa-YRQLUBcIeH_clWjGLKT9Na1DcnrNvfEHw6WFXR0IachIPjP7ceIg/exec?action=colAReemplazo',
			{ credentials: 'omit' }
		);

		const data = await response.json();

		const folios = Array.isArray(data)
			? data.map((n) => Number(n)).filter((n) => !isNaN(n))
			: [];

		if (folios.length === 0) return 1;

		const last = folios[folios.length - 1];
		return last + 1;

	} catch (error) {
		console.error('Error obteniendo folio:', error);
		return 1; 
	}
}