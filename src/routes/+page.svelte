<script lang="ts">
	import SearchBar from '../lib/components/SearchBar.svelte';
	import CPUForm from '$lib/components/CPUForm.svelte';
	import BackupForm from '$lib/components/BackupForm.svelte';
	import PerifericoForm from '$lib/components/PerifericoForm.svelte';
	import ReportanteForm from '$lib/components/ReportanteForm.svelte';
	import FinalButtons from '$lib/components/FinalButtons.svelte';

	import { initialReportData } from '$lib/constants/initialReportData';
	import { buscarEnSheets } from '../lib/services/sheets';
	import type { ReportData } from '$lib/types/report';
	import type { SvelteComponent } from 'svelte';
	import { generarFicha } from '$lib/services/docGenerator';

	let step = 1;

	let reportData: ReportData = { ...initialReportData };

	type FormWithEnviarDatos = SvelteComponent & { enviarDatos: () => void };

	let reportanteRef: FormWithEnviarDatos | undefined;
	let cpuForm: FormWithEnviarDatos | undefined;
	let perifericoRef: FormWithEnviarDatos | undefined;
	let backupRef: FormWithEnviarDatos | undefined;

	function next() {
		if (step === 1 && reportanteRef) reportanteRef.enviarDatos();
		if (step === 2 && cpuForm) cpuForm.enviarDatos();
		if (step === 3 && perifericoRef) perifericoRef.enviarDatos();
		if (step < 4) step++;
	}
	function prev() {
		if (step > 1) step--;
	}

	async function recibirBusqueda(
		e: CustomEvent<{ tipo: string; codigo: string; tipoBusqueda: string }>
	) {
		const { codigo, tipoBusqueda, tipo } = e.detail;

		const data = await buscarEnSheets(tipoBusqueda, codigo);

		if (!data || data.length === 0) return;

		const eq = data[0];

		// === RELLENAR REPORTANTE COMO ANTES ===
		reportanteRef?.setData({
			Location: eq.Location
		});

		if (tipo === '4') {
			// === RELLENAR BACKUP ===
			backupRef?.setData({
				// aquí van los campos que necesites pasar al backup
				backupField1: eq.BackupField1,
				backupField2: eq.BackupField2
				// etc.
			});
			return; // si solo quieres enviar al backup, puedes terminar aquí
		}

		// === 1. BÚSQUEDA POR CÓDIGO PATRIMONIAL ===
		if (tipoBusqueda === '1') {
			switch (eq.matchField) {
				case 'AssetCode':
					cpuForm?.setData(eq);
					break;
				case 'MonitorCode':
					perifericoRef?.setData({
						monitor_brand: eq.MonitorBrand,
						monitor_code: eq.MonitorCode,
						monitor_serial: eq.MonitorSerial
					});
					break;
				case 'KeyboardCode':
					perifericoRef?.setData({
						keyboard_brand: eq.KeyboardBrand,
						keyboard_code: eq.KeyboardCode,
						keyboard_serial: eq.KeyboardSerial
					});
					break;
				case 'MouseCode':
					perifericoRef?.setData({
						mouse_brand: eq.MouseBrand,
						mouse_code: eq.MouseCode,
						mouse_serial: eq.MouseSerial
					});
					break;
			}

			return;
		}

		// === 2. BÚSQUEDA POR SERIE ===
		switch (eq.matchField) {
			case 'Serial':
				cpuForm?.setData(eq);
				break;
			case 'MonitorSerial':
				perifericoRef?.setData({
					monitor_brand: eq.MonitorBrand,
					monitor_serial: eq.MonitorSerial
				});
				break;
			case 'KeyboardSerial':
				perifericoRef?.setData({
					keyboard_brand: eq.KeyboardBrand,
					keyboard_serial: eq.KeyboardSerial
				});
				break;
			case 'MouseSerial':
				perifericoRef?.setData({
					mouse_brand: eq.MouseBrand,
					mouse_serial: eq.MouseSerial
				});
				break;
		}
	}

	function generarWord() {
		generarFicha(reportData);
	}

	async function enviarSheets() {}
</script>

<div class="container">
	<header>
		<SearchBar on:buscar={recibirBusqueda} />
	</header>

	<div class="steps">
		<div class="step {step >= 1 ? 'active' : ''}">1</div>
		<div class="line"></div>
		<div class="step {step >= 2 ? 'active' : ''}">2</div>
		<div class="line"></div>
		<div class="step {step >= 3 ? 'active' : ''}">3</div>
		<div class="line"></div>
		<div class="step {step >= 4 ? 'active' : ''}">4</div>
	</div>

	<div class="form-card">
		{#if step === 1}
			<h2>Datos del Reportante</h2>
			<ReportanteForm
				bind:this={reportanteRef}
				on:update={(e) => {
					reportData = { ...reportData, ...e.detail };
				}}
			/>
		{/if}

		{#if step === 2}
			<h2>Datos del Equipo</h2>
			<CPUForm
				bind:this={cpuForm}
				on:update={(e) => {
					reportData = { ...reportData, ...e.detail };
				}}
			/>
		{/if}

		{#if step === 3}
			<h2>Periféricos</h2>
			<PerifericoForm
				bind:this={perifericoRef}
				on:update={(e) => {
					reportData = { ...reportData, ...e.detail };
				}}
			/>
		{/if}

		{#if step === 4}
			<h2>Backup</h2>
			<BackupForm
				bind:this={backupRef}
				on:update={(e) => {
					reportData = { ...reportData, ...e.detail };
				}}
			/>

			<FinalButtons on:generarWord={generarWord} on:enviarSheets={enviarSheets} />
		{/if}

		<div class="nav-buttons">
			{#if step > 1}
				<button class="btn prev" on:click={prev}>Atrás</button>
			{/if}

			{#if step < 4}
				<button class="btn next" on:click={next}>Siguiente</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.container {
		margin: 0 auto;
		padding: 1.5rem;
		max-width: 900px;
	}

	header {
		margin-bottom: 2rem;
	}

	.steps {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin-bottom: 1.5rem;
	}

	.step {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: #d4d4d4;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 600;
		color: #555;
	}

	.step.active {
		background: #0070f3;
		color: white;
	}

	.line {
		flex: 1;
		height: 2px;
		background: #ccc;
	}

	.form-card {
		background: white;
		border-radius: 14px;
		padding: 1.5rem;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
		border: 1px solid #eee;
	}

	h2 {
		margin-bottom: 1rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: #333;
	}

	.nav-buttons {
		display: flex;
		justify-content: space-between;
		margin-top: 1.5rem;
	}

	button {
		padding: 0.5rem 1.2rem;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		font-weight: 600;
	}

	.prev {
		background: #ddd;
	}

	.next {
		background: #0070f3;
		color: white;
	}
</style>
