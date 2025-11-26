export async function enviarDatosASheets(reportData: any) {
  const url = "https://script.google.com/macros/s/AKfycbwHlyZmiAQ6Cdgoa-YRQLUBcIeH_clWjGLKT9Na1DcnrNvfEHw6WFXR0IachIPjP7ceIg/exec";

  const form = new FormData();

  // === CAMPOS SIMPLES ===
  form.append("loc", reportData.location || "");
  form.append("fecha", reportData.issue_date || "");
  form.append("motivo", reportData.action_plan || "");
  form.append("tech", reportData.technician || "");
  form.append("obs_out", reportData.observations || "");
  form.append("obs_in", reportData.bk_obs || "");

  // === RESÚMENES FORMATEADOS ===
  form.append(
    "old_equipo",
    `CPU: ${reportData.cpu ?? ""} | Serie: ${reportData.serial ?? ""} | Patrimonial: ${reportData.asset_code ?? ""} | Placa: ${reportData.plate ?? ""}`
  );

  form.append(
    "old_monitor",
    `Marca: ${reportData.monitor_brand ?? ""} | Código: ${reportData.monitor_code ?? ""} | Serie: ${reportData.monitor_serial ?? ""}`
  );

  form.append(
    "old_teclado",
    `Marca: ${reportData.keyboard_brand ?? ""} | Código: ${reportData.keyboard_code ?? ""} | Serie: ${reportData.keyboard_serial ?? ""}`
  );

  form.append(
    "old_mouse",
    `Marca: ${reportData.mouse_brand ?? ""} | Código: ${reportData.mouse_code ?? ""} | Serie: ${reportData.mouse_serial ?? ""}`
  );

  // === BACKUP / NUEVOS ===
  form.append(
    "new_equipo",
    `CPU: ${reportData.bk_cpu ?? ""} | Serie: ${reportData.bk_serial ?? ""} | Patrimonial: ${reportData.bk_asset ?? ""} | Placa: ${reportData.bk_plate ?? ""}`
  );

  form.append(
    "new_monitor",
    `Marca: ${reportData.bk_monitor ?? ""} | Código: ${reportData.bk_mon_code ?? ""} | Serie: ${reportData.bk_mon_serial ?? ""}`
  );

  form.append(
    "new_teclado",
    `Marca: ${reportData.bk_keyboard ?? ""} | Código: ${reportData.bk_key_code ?? ""} | Serie: ${reportData.bk_key_serial ?? ""}`
  );

  form.append(
    "new_mouse",
    `Marca: ${reportData.bk_mouse ?? ""} | Código: ${reportData.bk_mouse_code ?? ""} | Serie: ${reportData.bk_mouse_serial ?? ""}`
  );

  // === ENVÍO ===
  const res = await fetch(url, {
    method: "POST",
    body: form,   
  });

  const data = await res.json();
    console.log("Respuesta de Apps Script:", data);

  alert("Respuesta del servidor:\n" + JSON.stringify(data, null, 2));
  return data;
}
