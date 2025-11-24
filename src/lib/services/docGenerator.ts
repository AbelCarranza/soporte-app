import type { ReportData } from '$lib/types/report';

export async function generarFicha(data: ReportData) {
	// Importar SOLO dentro de la función (en cliente)
	const PizZip = (await import('pizzip')).default;
	const Docxtemplater = (await import('docxtemplater')).default;
	const PizZipUtils = (await import('pizzip/utils/index.js')).default;

	function loadFile(url: string): Promise<any> {
		return new Promise((resolve, reject) => {
			PizZipUtils.getBinaryContent(url, (err: any, data: any) => {
				if (err) reject(err);
				else resolve(data);
			});
		});
	}

	console.log('Generando Word con los siguientes datos:', data);

	const content = await loadFile('/templates/Ficha.docx');

	const zip = new PizZip(content);

	const doc = new Docxtemplater(zip, {
		paragraphLoop: true,
		linebreaks: true
	});

	doc.render(data);

	const blob = doc.getZip().generate({
		type: 'blob',
		mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	});

	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'FichaTecnica.docx';
	a.click();
}
