<script lang="ts">
	import InputField from './InputField.svelte';
	import { createEventDispatcher } from 'svelte';
	import { reportStore } from '$lib/stores/reportStorage';

	const dispatch = createEventDispatcher();

	let brand = '';
	let asset_code = '';
	let serial = '';
	let plate = '';
	let cpu = '';
	let speed = '';
	let ram = '';

	let hdd_brand = '';
	let hdd_capacity = '';
	let hdd_technology = '';

	// Checkbox para mostrar/ocultar toda la sección
	let showHardware = true;

	export let autocompletar = false;

	// Suscripción al store
	reportStore.subscribe((data) => {
		brand = data.brand ?? '';
		asset_code = data.asset_code ?? '';
		cpu = data.cpu ?? '';
		speed = data.speed ?? '';
		ram = data.ram ?? '';
		hdd_brand = data.hdd_brand ?? '';
		hdd_capacity = data.hdd_capacity ?? '';
		hdd_technology = data.hdd_technology ?? '';
		serial = data.serial ?? '';
		plate = data.plate ?? '';
	});

	// LIMPIAR todo cuando se desactiva el checkbox
	$: if (!showHardware) {
		brand = '';
		asset_code = '';
		serial = '';
		plate = '';
		cpu = '';
		speed = '';
		ram = '';
		hdd_brand = '';
		hdd_capacity = '';
		hdd_technology = '';
	}

	// Setear datos desde otra parte del sistema
	export function setData(values: any) {
		reportStore.update((current) => ({
			...current,
			brand: values.Brand,
			asset_code: values.AssetCode,
			cpu: values.CPU,
			speed: values.CPUSpeed,
			ram: values.RAM,
			hdd_brand: values.HDDBrand,
			hdd_capacity: values.HDDCapacity,
			hdd_technology: values.HDDTechnology,
			serial: values.Serial,
			plate: values.Plate
		}));
	}

	// Enviar datos al padre
	export function enviarDatos() {
		dispatch('update', {
			brand,
			asset_code,
			serial,
			plate,
			cpu,
			speed,
			ram,
			hdd_brand,
			hdd_capacity,
			hdd_technology,
			autocompletar
		});
	}
</script>

<label class="checkbox-autofill section-toggle">
	<input type="checkbox" bind:checked={showHardware} />
	<span>🖥️ Mostrar Información del Equipo</span>
</label>
<div class="form-container">
	{#if showHardware}
		<div class="form-section">
			<div class="form-grid">
				<div class="form-row">
					<InputField label="Marca" bind:value={brand} placeholder="Ej: Dell, HP, Lenovo" />
					<InputField
						label="Código Patrimonial"
						bind:value={asset_code}
						placeholder="Ej: PAT-001234"
					/>
					<InputField label="Número de Serie" bind:value={serial} placeholder="Ej: SN123456789" />
				</div>

				<div class="form-row">
					<InputField label="Placa" bind:value={plate} placeholder="Ej: Gigabyte" required />
					<InputField label="Procesador" bind:value={cpu} placeholder="Ej: Intel Core i5" />
					<InputField label="Velocidad del CPU" bind:value={speed} placeholder="Ej: 2.4 GHz" />
					<InputField label="Memoria RAM" bind:value={ram} placeholder="Ej: 8 GB" required />
				</div>
			</div>
		</div>
		<div class="form-section">
			<h2 class="section-title">
				<span class="icon">💾</span>
				Disco Duro
			</h2>

			<div class="form-grid">
				<div class="form-row">
					<InputField
						label="Marca del Disco"
						bind:value={hdd_brand}
						placeholder="Ej: Seagate, WD"
					/>
					<InputField label="Capacidad" bind:value={hdd_capacity} placeholder="Ej: 1 TB" required />
					<InputField
						label="Tecnología"
						bind:value={hdd_technology}
						placeholder="Ej: SSD, HDD, NVMe"
					/>
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
