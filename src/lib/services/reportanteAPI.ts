let reportantesSimulados: string[] = ['Juan Pérez', 'María López', 'Luis García'];

// Obtener la lista de reportantes
export async function getReportantes(): Promise<string[]> {
	// Simulamos un fetch con un pequeño delay
	return new Promise((resolve) => {
		setTimeout(() => resolve([...reportantesSimulados]), 200);
	});
}

// Agregar un nuevo reportante
export async function addReportante(nombre: string): Promise<void> {
	if (!reportantesSimulados.includes(nombre)) {
		reportantesSimulados.push(nombre);
	}
	// Simulamos una llamada a API
	return new Promise((resolve) => setTimeout(resolve, 200));
}