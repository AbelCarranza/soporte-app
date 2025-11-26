<script lang="ts">
	import SearchBar from '../lib/components/SearchBar.svelte';
	import CPUForm from '$lib/components/CPUForm.svelte';
	import BackupForm from '$lib/components/BackupForm.svelte';
	import PerifericoForm from '$lib/components/PerifericoForm.svelte';
	import ReportanteForm from '$lib/components/ReportanteForm.svelte';
	import FinalButtons from '$lib/components/FinalButtons.svelte';
	import CPUReplacementForm from '$lib/components/CPUReplacementForm.svelte';
	import PerifericoReplacementForm from '$lib/components/PerifericoReplacementForm.svelte';
	import { decisionStore } from '$lib/stores/decisionStore';
	import { stepStore } from '$lib/stores/stepStore';
	import { get } from 'svelte/store';

	import { initialReportData } from '$lib/constants/initialReportData';
	import { generarFicha } from '$lib/services/docGenerator';
	import { recibirBusquedaHandler } from '$lib/services/recibirBusqueda';
	import type { ReportData } from '$lib/types/report';
	import type { SvelteComponent } from 'svelte';

	let step = get(stepStore);
	const decisionData = get(decisionStore);

	$: stepStore.set(step);

	let reportData: ReportData = {
		...initialReportData,
		...decisionData
	};

	type FormWithEnviarDatos = SvelteComponent & { enviarDatos: () => void };

	$: esReemplazo = reportData.selected_decision === 'Reemplazo con Equipo de Reserva';

	let reportanteRef: FormWithEnviarDatos | undefined;
	let cpuForm: FormWithEnviarDatos | undefined;
	let perifericoRef: FormWithEnviarDatos | undefined;
	let backupRef: FormWithEnviarDatos | undefined;
	let cpuReplacementRef: FormWithEnviarDatos | undefined;
	let perifericoReplacementRef: FormWithEnviarDatos | undefined;

	$: totalSteps = esReemplazo ? 6 : 4;

	function next() {
		if (step === 1 && reportanteRef) reportanteRef.enviarDatos();
		if (step === 2 && cpuForm) cpuForm.enviarDatos();
		if (step === 3 && perifericoRef) perifericoRef.enviarDatos();
		if (step === 4 && backupRef) backupRef.enviarDatos();
		if (step === 5 && cpuReplacementRef) cpuReplacementRef.enviarDatos();
		if (step === 6 && perifericoReplacementRef) perifericoReplacementRef.enviarDatos();

		if (step < totalSteps) step++;
	}
	function prev() {
		if (step > 1) step--;
	}

	async function recibirBusqueda(e: CustomEvent<{ tipo: string; codigo: string; form: string }>) {
		await recibirBusquedaHandler(e, {
			reportanteRef,
			cpuForm,
			perifericoRef,
			cpuReplacementRef,
			perifericoReplacementRef
		});
	}

	function generarWord() {
		if (step === 6 && perifericoReplacementRef) {
			perifericoReplacementRef.enviarDatos();
		}
		generarFicha(reportData);
	}

	async function enviarSheets() {}
</script>

<div class="container-head">
	<div>
		<img src="src/lib/assets/logo_resize .webp" alt="logo" />
	</div>
	<header>
		<SearchBar on:buscar={recibirBusqueda} />
	</header>
</div>

<div class="container">
	<div class="steps">
		<div class="step {step >= 1 ? 'active' : ''}">1</div>
		<div class="line"></div>

		<div class="step {step >= 2 ? 'active' : ''}">2</div>
		<div class="line"></div>

		<div class="step {step >= 3 ? 'active' : ''}">3</div>
		<div class="line"></div>

		<div class="step {step >= 4 ? 'active' : ''}">4</div>

		{#if esReemplazo}
			<div class="line"></div>
			<div class="step {step >= 5 ? 'active' : ''}">5</div>
			<div class="line"></div>
			<div class="step {step >= 6 ? 'active' : ''}">6</div>
		{/if}
	</div>

	<div class="form-card">
		{#if step === 1}
			<h2>Datos del Reportante</h2>
			<ReportanteForm
				bind:this={reportanteRef}
				on:update={(e) => (reportData = { ...reportData, ...e.detail })}
			/>
		{/if}

		{#if step === 2}
			<h2>Datos del Equipo</h2>
			<CPUForm
				bind:this={cpuForm}
				on:update={(e) => (reportData = { ...reportData, ...e.detail })}
			/>
		{/if}

		{#if step === 3}
			<h2>Periféricos</h2>
			<PerifericoForm
				bind:this={perifericoRef}
				on:update={(e) => (reportData = { ...reportData, ...e.detail })}
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
		{/if}

		<!-- PASO 5: CPU DE REEMPLAZO -->
		{#if step === 5 && esReemplazo}
			<h2>Datos del Equipo de Reemplazo</h2>
			<CPUReplacementForm
				bind:this={cpuReplacementRef}
				on:update={(e) => {
					reportData = { ...reportData, ...e.detail };
				}}
			/>
		{/if}

		<!-- PASO 6: PERIFÉRICOS DE REEMPLAZO -->
		{#if step === 6 && esReemplazo}
			<h2>Periféricos del Equipo de Reemplazo</h2>
			<PerifericoReplacementForm
				bind:this={perifericoReplacementRef}
				on:update={(e) => {
					reportData = { ...reportData, ...e.detail };
				}}
			/>
		{/if}

		{#if (!esReemplazo && step === 4) || (esReemplazo && step === 6)}
			<FinalButtons on:generarWord={generarWord} on:enviarSheets={enviarSheets} />
		{/if}

		<!-- BOTONES -->
		<div class="nav-buttons">
			{#if step > 1}
				<button class="btn prev" on:click={prev}>Atrás</button>
			{/if}

			<!-- Condición dinámica -->
			{#if (!esReemplazo && step < 4) || (esReemplazo && step < 6)}
				<button class="btn next" on:click={next}>Siguiente</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.container-head {
		display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: #1e5aa8;
		box-shadow: -2px 12px 5px 2px rgb(0 0 255 / 0.2);
	}
	.container-head img {
		padding: 10px;
	}
	.container {
		margin: 0 auto;
		padding: 1.5rem;
		max-width: 900px;
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
