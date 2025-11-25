export interface ReportData {
  // Información general
  issue_date?: string;     
  ticket_id?: string;       
  reported_by?: string;     
  location?: string;        

  // Datos del equipo
  brand?: string;
  asset_code?: string;
  serial?: string;
  plate?: string;
  cpu?: string;
  speed?: string;
  ram?: string;

  // Disco duro
  hdd_brand?: string;
  hdd_capacity?: string;
  hdd_technology?: string;
  operating_system?: string;

  observations?: string;

  // Periféricos
  monitor_brand?: string;
  monitor_serial?: string;
  monitor_code?: string;
  keyboard_brand?: string;
  keyboard_serial?: string;
  keyboard_code?: string;
  mouse_brand?: string;
  mouse_serial?: string;
  mouse_code?: string;
  other_peripheral?: string;

  // Plan de acción
  action_plan?: string;

	// Agregar este campo:
	selected_decision: string;

	// Si tu BackupForm tiene estos, agrégalos también:
	replacement_brand?: string;
	replacement_serial?: string;
	replacement_asset_code?: string;
	replacement_specs?: string;

	// Si harás pasos 5 y 6:
	replacement_cpu?: any;
	replacement_peripherals?: any;
  
  // Registro y cierre
  technician?: string;
}
