export interface ReportData {
  // Información general
  issue_date?: string;     
  ticket_id?: number;       
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
  observations ?: string;

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

  // Plan de acción
  action_plan?: string;

	// Agregar este campo:
	selected_decision: string;

  // Datos del equipo BK
  bk_brand?: string;
  bk_asset?: string;
  bk_serial?: string;
  bk_plate?: string;
  bk_cpu?: string;
  bk_speed?: string;
  bk_ram?: string;

  // Disco duro BK
  bk_hdbrand: string;
  bk_hdd_cap?: string;
  bk_hdd_tech?: string;
  bk_obs?: string;


  // Periféricos BK
  bk_monitor?: string;
  bk_mon_serial?: string;
  bk_mon_code?: string;
  bk_keyboard?: string;
  bk_key_serial?: string;
  bk_key_code?: string;
  bk_mouse?: string;
  bk_mouse_code?: string;
  bk_mouse_serial?: string;



  
  // Registro y cierre
  technician?: string;
  showHardware: boolean;
}


