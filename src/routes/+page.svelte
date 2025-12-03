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
	import { notifyError, notifySuccess } from '$lib/services/notyf';

	import { decisionStore } from '$lib/stores/decisionStore';
	import { stepStore } from '$lib/stores/stepStore';
	import { resetAllStores } from '$lib/stores/resetStores';
	import { get } from 'svelte/store';

	import type { ReportData } from '$lib/types/report';
	import type { SvelteComponent } from 'svelte';
	import { initialReportData } from '$lib/constants/initialReportData';

	import { onMount } from 'svelte';
	import { getFolio } from '$lib/services/folio';

	let step = get(stepStore);
	const decisionData = get(decisionStore);

	let loadingSearch = false;
	let loadingSheets = false;
	let ticket_id: number | null = null;
	let cargandoFolio = true;

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

	$: descripcionPaso =
		step === 1
			? 'Introduce los datos del reportante.'
			: step === 2
				? 'Completa la información del equipo.'
				: step === 3
					? 'Agrega los periféricos asociados.'
					: step === 4
						? 'Registra la información del backup.'
						: step === 5
							? 'Datos del equipo de reemplazo.'
							: step === 6
								? 'Periféricos del equipo de reemplazo.'
								: '';

	onMount(async () => {
		ticket_id = await getFolio();
		cargandoFolio = false;
	});

	$: if (ticket_id !== null) {
		reportData.ticket_id = ticket_id;
	}

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

	async function goTo(num: number) {
		if (num > 1 && reportanteRef) {
			const ok = await reportanteRef.enviarDatos();
			if (!ok) return;
		}

		step = num;
	}

	async function recibirBusqueda(e: CustomEvent<{ tipo: string; codigo: string; form: string }>) {
		const { tipo } = e.detail;
		if (
			tipo === '4' && // Entrada
			!((step === 4 && esReemplazo) || (esReemplazo && (step === 5 || step === 6)))
		) {
			notifyError(
				'La búsqueda por *Entrada* solo está permitida durante el proceso de Reemplazo de Equipo de Reserva.'
			);
			return;
		}
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
			notifySuccess('Datos enviados correctamente');

			resetAllStores();

			reportData = {
				...initialReportData,
				selected_decision: ''
			};

			wordGenerado = false;
			step = 1;
		} catch (err) {
			console.error(err);
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
		<img src="/logo_resize.webp" alt="logo" />
	</div>
	<header>
		<SearchBar on:buscar={recibirBusqueda} loading={loadingSearch} />
	</header>
</div>

<div class="layout">
	<!-- Sidebar -->
	<div class="sidebar">
		<h3 class="sidebar-title">Paso {step}</h3>
		<p class="sidebar-sub">{descripcionPaso}</p>

		<ul class="menu">
			<li>
				<button
					type="button"
					class="menu-item {step === 1 ? 'active' : ''}"
					on:click={() => goTo(1)}
				>
					<span class="icon-circle"><i class="fa-solid fa-user"></i></span>
					Datos del Reportante
				</button>
			</li>

			<li>
				<button
					type="button"
					class="menu-item {step === 2 ? 'active' : ''}"
					on:click={() => goTo(2)}
				>
					<span class="icon-circle"><i class="fa-solid fa-laptop"></i></span>
					Datos del Equipo
				</button>
			</li>

			<li>
				<button
					type="button"
					class="menu-item {step === 3 ? 'active' : ''}"
					on:click={() => goTo(3)}
				>
					<span class="icon-circle"><i class="fa-solid fa-computer-mouse"></i></span>
					Periféricos
				</button>
			</li>

			<li>
				<button
					type="button"
					class="menu-item {step === 4 ? 'active' : ''}"
					on:click={() => goTo(4)}
				>
					<span class="icon-circle"><i class="fa-solid fa-box"></i></span>
					Backup
				</button>
			</li>

			{#if esReemplazo}
				<li>
					<button
						type="button"
						class="menu-item {step === 5 ? 'active' : ''}"
						on:click={() => goTo(5)}
					>
						<span class="icon-circle"><i class="fa-solid fa-laptop-code"></i></span>
						Equipo de Reemplazo
					</button>
				</li>

				<li>
					<button
						type="button"
						class="menu-item {step === 6 ? 'active' : ''}"
						on:click={() => goTo(6)}
					>
						<span class="icon-circle"><i class="fa-solid fa-computer-mouse"></i></span>
						Periféricos Reemplazo
					</button>
				</li>
			{/if}
		</ul>
	</div>

	<!-- CONTENT -->
	<div class="content">
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
					on:update={(e) => (reportData = { ...reportData, ...e.detail })}
				/>
			{/if}

			{#if step === 5 && esReemplazo}
				<h2>Datos del Equipo de Reemplazo</h2>
				<CPUReplacementForm
					bind:this={cpuReplacementRef}
					on:update={(e) => (reportData = { ...reportData, ...e.detail })}
				/>
			{/if}

			{#if step === 6 && esReemplazo}
				<h2>Periféricos del Equipo de Reemplazo</h2>
				<PerifericoReplacementForm
					bind:this={perifericoReplacementRef}
					on:update={(e) => (reportData = { ...reportData, ...e.detail })}
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

				{#if (!esReemplazo && step < 4) || (esReemplazo && step < 6)}
					<button class="btn next" on:click={next}>Siguiente</button>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.container-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: white;
		padding: 5px;
	}
	/* Layout general */
	.layout {
		display: flex;
		min-height: 100vh;
	}

	/* Sidebar */
	.sidebar {
		width: 260px;
		background: #0e2239;
		padding: 25px 20px;
		color: white;
	}

	.sidebar-title {
		font-size: 1.4rem;
		font-weight: 600;
		margin-bottom: 2px;
	}

	.sidebar-sub {
		font-size: 0.9rem;
		color: #9cb6d1;
		margin-bottom: 20px;
	}

	.menu {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.menu-item {
		background: transparent;
		border: none;
		text-align: left;
		padding: 12px 20px;
		margin: 0 -20px;
		display: flex;
		align-items: center;
		width: calc(100% + 40px);
		border-radius: 0;
		color: #c8d7e5;
		cursor: pointer;
		transition: 0.2s;
		font-size: 1rem;
	}

	.menu-item:hover {
		background: #173657;
	}

	.menu-item.active {
		background: #1f4e7a;
		color: white;
		font-weight: 600;
	}

	.content {
		flex: 1;
		display: flex;
		justify-content: center;
		padding: 40px 20px;
	}

	.form-card {
		width: 900px;
		background: white;
		padding: 30px;
		border-radius: 12px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}

	h2 {
		margin-bottom: 20px;
		color: #22354a;
		font-size: 1.6rem;
		font-weight: 700;
		border-bottom: 2px solid #e2e8f0;
		padding-bottom: 16px;
	}

	.nav-buttons {
		margin-top: 25px;
		display: flex;
		justify-content: space-between;
	}

	.btn {
		padding: 10px 18px;
		border-radius: 6px;
		border: none;
		cursor: pointer;
		font-size: 1rem;
	}

	.prev {
		background: #ccc;
	}

	.next {
		background: #1e88e5;
		color: white;
	}

	.icon-circle {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: #5c6269;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12px;
		font-size: 15px;
		transition: 0.2s;
	}

	.menu-item.active .icon-circle {
		background: green;
	}

	.menu-item:hover .icon-circle {
		background: green;
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
	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
		animation: fadeInBg 0.25s ease-out;
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
