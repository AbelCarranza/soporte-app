export interface ReplacementData {
  bk_brand?: string;
  bk_asset?: string;
  bk_serial?: string;
  bk_plate?: string;
  bk_cpu?: string;
  bk_speed?: string;
  bk_ram?: string;

  bk_hdbrand?: string;
  bk_hdd_cap?: string;
  bk_hdd_tech?: string;

  bk_obs?: string;

  showReplacementHardware?: boolean; 
}

export interface SetReplacementValues {
  Brand: string;
  AssetCode: string;
  Serial: string;
  Plate: string;
  CPU: string;
  CPUSpeed: string;
  RAM: string;
  HDDBrand: string;
  HDDCapacity: string;
  HDDTechnology: string;
}