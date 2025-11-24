// src/lib/stores/reportStore.ts
import { writable } from 'svelte/store';
import { loadFromStorage, saveToStorage } from './localStorage';

const KEY = "reportData";

export const reportStore = writable(
	loadFromStorage(KEY, {
		issue_date: "",
		ticket_id: "",
		reported_by: "",
		location: "",
		brand: "",
		asset_code: "",
		serial: "",
		plate: "",
		cpu: "",
		speed: "",
		ram: "",
		hdd_brand: "",
		hdd_capacity: "",
		hdd_technology: "",
		operating_system: "",
		observations: "",
		monitor_brand: "",
		monitor_serial: "",
		keyboard_brand: "",
		keyboard_serial: "",
		mouse_brand: "",
		mouse_serial: "",
		other_peripheral: "",
		action_plan: "",
		replacement_brand: "",
		replacement_serial: "",
		replacement_asset_code: "",
		replacement_specs: "",
		technician: "",
		matchField: ""
	})
);


reportStore.subscribe((value) => {
	saveToStorage(KEY, value);
});
