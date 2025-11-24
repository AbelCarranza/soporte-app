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

	let os = '';
	let observations = '';

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
		os = data.os ?? '';
		plate = data.plate ?? '';
		observations = data.observations ?? '';
	});

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
			os: values.OS,
			plate: values.Plate
		}));
	}
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
			os,
			observations
		});
	}
</script>

<div class="form-container">
	<div>
		<!-- Sección de Información del Equipo -->
		<div class="form-section">
			<h2 class="section-title">
				<span class="icon">💻</span>
				Información del Equipo
			</h2>
			<div class="form-grid">
				<div class="form-row">
					<InputField
						label="Marca"
						bind:value={brand}
						placeholder="Ej: Dell, HP, Lenovo"
						required
					/>
					<InputField
						label="Código Patrimonial"
						bind:value={asset_code}
						placeholder="Ej: PAT-001234"
						required
					/>
					<InputField
						label="Número de Serie"
						bind:value={serial}
						placeholder="Ej: SN123456789"
						required
					/>
				</div>
				<div class="form-row">
					<InputField label="Placa" bind:value={plate} placeholder="Ej: Gigagyte" required />
					<InputField
						label="Procesador"
						bind:value={cpu}
						placeholder="Ej: Intel Core i5"
						required
					/>
					<InputField
						label="Velocidad del CPU"
						bind:value={speed}
						placeholder="Ej: 2.4 GHz"
						required
					/>
					<InputField label="Memoria RAM" bind:value={ram} placeholder="Ej: 8 GB" required />
				</div>
			</div>
		</div>
	</div>

	<div>
		<!-- Sección de Disco Duro -->
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
						required
					/>
					<InputField label="Capacidad" bind:value={hdd_capacity} placeholder="Ej: 1 TB" required />
					<InputField
						label="Tecnología"
						bind:value={hdd_technology}
						placeholder="Ej: SSD, HDD, NVMe"
						required
					/>
				</div>
			</div>
		</div>

		<!-- Sección de Sistema Operativo -->
		<div class="form-section">
			<h2 class="section-title">
				<span class="icon">🖥️</span>
				Sistema Operativo
			</h2>
			<div class="form-grid">
				<div class="form-row">
					<InputField
						label="Sistema Operativo"
						bind:value={os}
						placeholder="Ej: Windows 10 Pro, Ubuntu 20.04"
						required
					/>
				</div>
			</div>
		</div>

		<!-- Sección de Observaciones -->
		<div class="form-section">
			<h2 class="section-title">
				<span class="icon">📝</span>
				Observaciones
			</h2>
			<div class="form-grid">
				<div class="form-row full-width">
					<InputField
						label="Observaciones"
						bind:value={observations}
						placeholder="Ingrese cualquier observación adicional..."
					/>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.form-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 24px;
		background: #ffffff;
		border-radius: 12px;
		box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
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

	.form-row.full-width {
		grid-template-columns: 1fr;
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
		}

		.form-section {
			padding: 12px;
		}
	}
</style>
