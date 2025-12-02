export async function enviarDatosASheets(reportData: any) {
	const url =
		'https://script.google.com/macros/s/AKfycbwHlyZmiAQ6Cdgoa-YRQLUBcIeH_clWjGLKT9Na1DcnrNvfEHw6WFXR0IachIPjP7ceIg/exec?sheet=Reemplazo';

	const form = new FormData();

  form.append('ID', String(reportData.ticket_id));

	form.append('loc', reportData.location || '');
	form.append('fecha', reportData.issue_date || '');
	form.append('motivo', reportData.action_plan || '');
	form.append('tech', reportData.technician || '');
	form.append('obs_out', reportData.observations || '');
	form.append('obs_in', reportData.bk_obs || '');

function cleanField(v: any) {
  return v?.toString().trim() || "-";
}

function multi(...lines: string[]) {
  return lines.join("\n");
}

// === ANTIGUOS ===
form.append(
  "old_equipo",
  multi(
    `CPU: ${cleanField(reportData.cpu)}`,
    `Serie: ${cleanField(reportData.serial)}`,
    `Patrimonial: ${cleanField(reportData.asset_code)}`,
    `Placa: ${cleanField(reportData.plate)}`
  )
);

form.append(
  "old_monitor",
  multi(
    `Marca: ${cleanField(reportData.monitor_brand)}`,
    `Código: ${cleanField(reportData.monitor_code)}`,
    `Serie: ${cleanField(reportData.monitor_serial)}`
  )
);

form.append(
  "old_teclado",
  multi(
    `Marca: ${cleanField(reportData.keyboard_brand)}`,
    `Código: ${cleanField(reportData.keyboard_code)}`,
    `Serie: ${cleanField(reportData.keyboard_serial)}`
  )
);

form.append(
  "old_mouse",
  multi(
    `Marca: ${cleanField(reportData.mouse_brand)}`,
    `Código: ${cleanField(reportData.mouse_code)}`,
    `Serie: ${cleanField(reportData.mouse_serial)}`
  )
);

// === NUEVOS ===
form.append(
  "new_equipo",
  multi(
    `CPU: ${cleanField(reportData.bk_cpu)}`,
    `Serie: ${cleanField(reportData.bk_serial)}`,
    `Patrimonial: ${cleanField(reportData.bk_asset)}`,
    `Placa: ${cleanField(reportData.bk_plate)}`
  )
);

form.append(
  "new_monitor",
  multi(
    `Marca: ${cleanField(reportData.bk_monitor)}`,
    `Código: ${cleanField(reportData.bk_mon_code)}`,
    `Serie: ${cleanField(reportData.bk_mon_serial)}`
  )
);

form.append(
  "new_teclado",
  multi(
    `Marca: ${cleanField(reportData.bk_keyboard)}`,
    `Código: ${cleanField(reportData.bk_key_code)}`,
    `Serie: ${cleanField(reportData.bk_key_serial)}`
  )
);

form.append(
  "new_mouse",
  multi(
    `Marca: ${cleanField(reportData.bk_mouse)}`,
    `Código: ${cleanField(reportData.bk_mouse_code)}`,
    `Serie: ${cleanField(reportData.bk_mouse_serial)}`
  )
);
	// === ENVÍO ===
	const res = await fetch(url, {
		method: 'POST',
		body: form
	});

	const data = await res.json();


	return data;
}
