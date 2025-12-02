<script lang="ts">
	import SearchBar from '../lib/components/SearchBar.svelte';
	import CPUForm from '$lib/components/CPUForm.svelte';
	import BackupForm from '$lib/components/BackupForm.svelte';
	import PerifericoForm from '$lib/components/PerifericoForm.svelte';
	import ReportanteForm from '$lib/components/ReportanteForm.svelte';
	import FinalButtons from '$lib/components/FinalButtons.svelte';
	import CPUReplacementForm from '$lib/components/CPUReplacementForm.svelte';
	import PerifericoReplacementForm from '$lib/components/PerifericoReplacementForm.svelte';

	import { enviarDatosASheets } from '$lib/services/sheetsSender';
	import { generarFicha } from '$lib/services/docGenerator';
	import { recibirBusquedaHandler } from '$lib/services/recibirBusqueda';
	import { notifyError } from '$lib/services/notyf';

	import { decisionStore } from '$lib/stores/decisionStore';
	import { stepStore } from '$lib/stores/stepStore';
	import { resetAllStores } from '$lib/stores/resetStores';
	import { get } from 'svelte/store';

	import type { ReportData } from '$lib/types/report';
	import type { SvelteComponent } from 'svelte';
	import { initialReportData } from '$lib/constants/initialReportData';

	let step = get(stepStore);
	const decisionData = get(decisionStore);

	let loadingSearch = false;
	let loadingSheets = false;

	$: stepStore.set(step);

	let reportData: ReportData = {
		...initialReportData,
		...decisionData
	};

	$: esReemplazo = reportData.selected_decision === 'Reemplazo con Equipo de Reserva';

	$: totalSteps = esReemplazo ? 6 : 4;

	let wordGenerado = false;
	let mostrarPopup = false;

	let reportanteRef: { enviarDatos: () => Promise<boolean> } | null = null;
	let backupRef: { enviarDatos: () => boolean } | null = null;

	type FormWithEnviarDatos = SvelteComponent & {
		enviarDatos?: () => void;
	};

	let cpuForm: FormWithEnviarDatos | undefined;
	let perifericoRef: FormWithEnviarDatos | undefined;
	let cpuReplacementRef: FormWithEnviarDatos | undefined;
	let perifericoReplacementRef: FormWithEnviarDatos | undefined;

	async function next() {
		if (step === 1 && reportanteRef) {
			const ok = await reportanteRef.enviarDatos();
			if (!ok) return;
		}

		if (step === 2) cpuForm?.enviarDatos?.();
		if (step === 3) perifericoRef?.enviarDatos?.();
		if (step === 4 && backupRef) {
			const ok = backupRef.enviarDatos();
			if (!ok) return;
		}
		if (step === 5) cpuReplacementRef?.enviarDatos?.();
		if (step === 6) perifericoReplacementRef?.enviarDatos?.();

		if (step < totalSteps) step++;
	}

	function prev() {
		if (step > 1) step--;
	}

	function goTo(num: number) {
		if (num > 1 && reportanteRef) {
			const ok = reportanteRef.enviarDatos();
			if (!ok) return;
		}
		step = num;
	}

	async function recibirBusqueda(e: CustomEvent<{ tipo: string; codigo: string; form: string }>) {
		loadingSearch = true;

		try {
			await recibirBusquedaHandler(e, {
				reportanteRef,
				cpuForm,
				perifericoRef,
				cpuReplacementRef,
				perifericoReplacementRef
			});
		} finally {
			loadingSearch = false;
		}
	}

	function generarWord() {
		if (step === 6) {
			perifericoReplacementRef?.enviarDatos?.();
		}

		const { selected_decision, action_plan, other_description } = get(decisionStore);

		if (!selected_decision.trim()) {
			notifyError('Debe seleccionar una decisión antes de generar el Word.');
			return;
		}

		if (selected_decision === 'other' && !other_description.trim()) {
			notifyError('Debe describir la decisión antes de generar el Word.');
			return;
		}

		generarFicha(reportData);
		wordGenerado = true;
	}

	async function confirmarEnvio() {
		mostrarPopup = false;
		loadingSheets = true;

		try {
			await enviarDatosASheets(reportData);
			alert('Datos enviados correctamente');

			resetAllStores();

			reportData = {
				...initialReportData,
				selected_decision: ''
			};

			wordGenerado = false;
			step = 1;
		} catch (err) {
			console.error(err);
			alert('Error enviando a Sheets');
		} finally {
			loadingSheets = false;
		}
	}
</script>

{#if mostrarPopup}
	<div class="popup-overlay">
		<div class="popup">
			<h3>¿Enviar datos a Google Sheets?</h3>
			<p>Esta acción limpiará completamente el formulario. ¿Deseas continuar?</p>

			<div class="popup-buttons">
				<button class="confirm" on:click={confirmarEnvio}>Aceptar</button>
				<button class="cancel" on:click={() => (mostrarPopup = false)}>Cancelar</button>
			</div>
		</div>
	</div>
{/if}

<div class="container-head">
	<div>
		<img src="src/lib/assets/logo_resize .webp" alt="logo" />
	</div>
	<header>
		<SearchBar on:buscar={recibirBusqueda} loading={loadingSearch} />
	</header>
</div>

<div class="container">
	<div class="steps">
		<button class="step {step >= 1 ? 'active' : ''}" type="button" on:click={() => goTo(1)}
			>1</button
		>
		<div class="line"></div>

		<button class="step {step >= 2 ? 'active' : ''}" type="button" on:click={() => goTo(2)}
			>2</button
		>
		<div class="line"></div>

		<button class="step {step >= 3 ? 'active' : ''}" type="button" on:click={() => goTo(3)}
			>3</button
		>
		<div class="line"></div>

		<button class="step {step >= 4 ? 'active' : ''}" type="button" on:click={() => goTo(4)}
			>4</button
		>

		{#if esReemplazo}
			<div class="line"></div>
			<button class="step {step >= 5 ? 'active' : ''}" type="button" on:click={() => goTo(5)}
				>5</button
			>
			<div class="line"></div>
			<button class="step {step >= 6 ? 'active' : ''}" type="button" on:click={() => goTo(6)}
				>6</button
			>
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
			<FinalButtons
				on:generarWord={generarWord}
				on:confirmarEnvioSheets={() => (mostrarPopup = true)}
				canSend={wordGenerado}
				{loadingSheets}
			/>
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
		background: #ddd;
		border-radius: 50%;
		width: 35px;
		height: 35px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border: none;
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
	/* ---------- FONDO OSCURO ---------- */
	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.45);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
		backdrop-filter: blur(2px);
		animation: fadeInBg 0.25s ease-out forwards;
	}

	/* ---------- TARJETA DEL POPUP ---------- */
	.popup {
		background: #ffffff;
		padding: 24px 28px;
		border-radius: 14px;
		width: 380px;
		max-width: 90%;
		text-align: center;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
		transform: translateY(15px);
		opacity: 0;
		animation: popupSlideUp 0.25s ease-out forwards;
	}

	/* ---------- TITULO ---------- */
	.popup h3 {
		font-size: 20px;
		margin-bottom: 10px;
		font-weight: 600;
		color: #333;
	}

	/* ---------- TEXTO ---------- */
	.popup p {
		font-size: 15px;
		color: #555;
		margin-top: 0;
	}

	/* ---------- BOTONES ---------- */
	.popup-buttons {
		margin-top: 22px;
		display: flex;
		gap: 12px;
		justify-content: center;
		flex-wrap: wrap; /* hace responsive */
	}

	/* Botón aceptar */
	.popup-buttons .confirm {
		background: #2a8f2a;
		color: white;
		padding: 9px 18px;
		border-radius: 8px;
		font-size: 15px;
		min-width: 110px;
		transition: transform 0.15s;
	}

	.popup-buttons .confirm:hover {
		transform: scale(1.05);
	}

	/* Botón cancelar */
	.popup-buttons .cancel {
		background: #999;
		color: white;
		padding: 9px 18px;
		border-radius: 8px;
		font-size: 15px;
		min-width: 110px;
		transition: transform 0.15s;
	}

	.popup-buttons .cancel:hover {
		transform: scale(1.05);
	}

	/* ---------- ANIMACIONES ---------- */
	@keyframes fadeInBg {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes popupSlideUp {
		from {
			transform: translateY(30px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	/* ---------- RESPONSIVE EXTRA ---------- */
	@media (max-width: 450px) {
		.popup {
			width: 95%;
			padding: 20px;
			border-radius: 12px;
		}

		.popup h3 {
			font-size: 18px;
		}

		.popup p {
			font-size: 14px;
		}

		.popup-buttons {
			gap: 8px;
		}

		.popup-buttons button {
			width: 100%;
		}
	}
</style>
