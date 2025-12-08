<script lang="ts">
	import InputField from './InputField.svelte';
	import { createEventDispatcher } from 'svelte';
	import { replacementStore } from '$lib/stores/replacementStorage';
	import type { ReplacementData, SetReplacementValues } from '$lib/types/ReplacementData';
	import { validateHardware } from '$lib/utils/hardwareValidator';

	const dispatch = createEventDispatcher<{ update: ReplacementData }>();

	let bk_brand = '';
	let bk_asset = '';
	let bk_serial = '';
	let bk_plate = '';
	let bk_cpu = '';
	let bk_speed = '';
	let bk_ram = '';

	let bk_hdbrand = '';
	let bk_hdd_cap = '';
	let bk_hdd_tech = '';

	let initialized = false;
	let showReplacementHardware = false; 

	// Suscripción a la store
	replacementStore.subscribe((data: ReplacementData) => {
		bk_brand = data.bk_brand ?? '';
		bk_asset = data.bk_asset ?? '';
		bk_serial = data.bk_serial ?? '';
		bk_plate = data.bk_plate ?? '';
		bk_cpu = data.bk_cpu ?? '';
		bk_speed = data.bk_speed ?? '';
		bk_ram = data.bk_ram ?? '';

		bk_hdbrand = data.bk_hdbrand ?? '';
		bk_hdd_cap = data.bk_hdd_cap ?? '';
		bk_hdd_tech = data.bk_hdd_tech ?? '';

		// 🔥 Sincronizar el checkbox con el valor guardado
		showReplacementHardware = data.showReplacementHardware ?? false;

		initialized = true;
	});

	export function setData(values: SetReplacementValues): void {
		bk_brand = values.Brand ?? '';
		bk_asset = values.AssetCode ?? '';
		bk_serial = values.Serial ?? '';
		bk_plate = values.Plate ?? '';
		bk_cpu = values.CPU ?? '';
		bk_speed = values.CPUSpeed ?? '';
		bk_ram = values.RAM ?? '';

		bk_hdbrand = values.HDDBrand ?? '';
		bk_hdd_cap = values.HDDCapacity ?? '';
		bk_hdd_tech = values.HDDTechnology ?? '';
	}

	// 🔥 Actualizar store cuando cambien los valores cargados
	$: if (initialized) {
		replacementStore.update((current) => ({
			...current,
			showReplacementHardware,
			bk_brand,
			bk_asset,
			bk_serial,
			bk_plate,
			bk_cpu,
			bk_speed,
			bk_ram,
			bk_hdbrand,
			bk_hdd_cap,
			bk_hdd_tech
		}));
	}

	export function enviarDatos(): boolean {
		const fields = {
			bk_brand,
			bk_asset,
			bk_serial,
			bk_plate,
			bk_cpu,
			bk_speed,
			bk_ram,
			bk_hdbrand,
			bk_hdd_cap,
			bk_hdd_tech,
			showReplacementHardware
		};

		if (showReplacementHardware) {

			const valid = validateHardware(showReplacementHardware, fields);
			if (!valid) return false;

			replacementStore.update((current) => ({ ...current, ...fields }));
			dispatch('update', { ...fields });
			return true;

		} else {
			// Limpiar campos
			bk_brand = '';
			bk_asset = '';
			bk_serial = '';
			bk_plate = '';
			bk_cpu = '';
			bk_speed = '';
			bk_ram = '';
			bk_hdbrand = '';
			bk_hdd_cap = '';
			bk_hdd_tech = '';

			replacementStore.update((current) => ({
				...current,
				showReplacementHardware: false,
				bk_brand: '',
				bk_asset: '',
				bk_serial: '',
				bk_plate: '',
				bk_cpu: '',
				bk_speed: '',
				bk_ram: '',
				bk_hdbrand: '',
				bk_hdd_cap: '',
				bk_hdd_tech: ''
			}));

			dispatch('update', fields);
			return true;
		}
	}

	export function getCurrentState() {
		return { showReplacementHardware };
	}
</script>

<label class="checkbox-autofill section-toggle">
	<input type="checkbox" bind:checked={showReplacementHardware} />
	<span>🖥️ Mostrar Información del Equipo</span>
</label>

<div class="form-container">
	{#if showReplacementHardware}
		<div>
			<div class="form-section">
				<div class="form-grid">
					<div class="form-row">
						<InputField label="Marca" bind:value={bk_brand} placeholder="Ej: Dell, HP" required/>
						<InputField
							label="Código Patrimonial"
							bind:value={bk_asset}
							placeholder="Ej: PAT-001"
							required
						/>
						<InputField label="Número de Serie" bind:value={bk_serial} placeholder="Ej: SN123456" required/>
					</div>

					<div class="form-row">
						<InputField label="Placa" bind:value={bk_plate} placeholder="Ej: Gigabyte" required/>
						<InputField label="Procesador" bind:value={bk_cpu} placeholder="Ej: Intel Core i5" required/>
						<InputField label="Velocidad" bind:value={bk_speed} placeholder="Ej: 2.4 GHz" required/>
						<InputField label="Memoria RAM" bind:value={bk_ram} placeholder="Ej: 8 GB" required/>
					</div>
				</div>
			</div>
		</div>

		<div>
			<div class="form-section">
				<h2 class="section-title">
					<span class="icon">💾</span>
					Disco Duro
				</h2>

				<div class="form-grid">
					<div class="form-row">
						<InputField label="Marca del Disco" bind:value={bk_hdbrand} placeholder="Ej: WD" required/>
						<InputField label="Capacidad" bind:value={bk_hdd_cap} placeholder="Ej: 1 TB" required />
						<InputField label="Tecnología" bind:value={bk_hdd_tech} placeholder="Ej: SSD, HDD" required/>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.section-toggle {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		user-select: none;
	}

	.section-toggle input {
		transform: scale(1.3);
	}
	.form-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 24px;
		border-radius: 12px;
		display: flex;
		justify-content: space-around;
	}

	.form-section {
		margin-bottom: 10px;
		padding: 24px;
		background: #f8fafc;
		border-radius: 8px;
		border: 1px solid #e2e8f0;
		transition: all 0.3s ease;
	}

	.form-section:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		border-color: #cbd5e0;
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 0 0 20px 0;
		color: #2d3748;
		font-size: 1.25rem;
		font-weight: 600;
		border-bottom: 2px solid #e2e8f0;
		padding-bottom: 12px;
	}

	.icon {
		font-size: 1.5rem;
	}

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.form-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 20px;
		align-items: start;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.form-container {
			padding: 16px;
			margin: 8px;
		}

		.form-section {
			padding: 16px;
			margin-bottom: 24px;
		}

		.form-row {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		.section-title {
			font-size: 1.1rem;
		}
	}

	@media (max-width: 480px) {
		.form-container {
			padding: 12px;
			margin: 4px;
			flex-direction: column;
		}

		.form-section {
			padding: 12px;
		}
	}

	@media (max-width: 350px) {
		.form-container {
			padding: 10px;
			margin: 2px;
			flex-direction: column;
			gap: 12px;
		}

		.form-section {
			padding: 14px;
		}

		.section-title {
			font-size: 1rem;
			gap: 8px;
			padding-bottom: 8px;
		}

		.icon {
			font-size: 1.2rem;
		}

		.form-row {
			grid-template-columns: 1fr !important;
			gap: 14px;
		}

		.form-grid {
			gap: 14px;
		}

		:global(input),
		:global(select),
		:global(textarea) {
			font-size: 0.9rem !important;
			padding: 10px !important;
		}
	}

	@media (max-width: 300px) {
		.form-container {
			padding: 8px;
			margin: 0;
			flex-direction: column;
			gap: 10px;
		}

		.form-section {
			padding: 10px;
			border-radius: 6px;
		}

		.section-title {
			font-size: 0.9rem;
			gap: 6px;
			padding-bottom: 6px;
		}

		.icon {
			font-size: 1.1rem;
		}

		.form-row {
			grid-template-columns: 1fr !important;
			gap: 10px;
		}

		.form-grid {
			gap: 10px;
		}

		:global(input),
		:global(select),
		:global(textarea) {
			font-size: 0.8rem !important;
			padding: 8px !important;
		}

		:global(.input-field) {
			margin-bottom: 0 !important;
		}
	}
</style>
