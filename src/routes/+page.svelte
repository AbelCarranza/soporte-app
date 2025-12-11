<script lang="ts">
	import SearchBar from '../lib/components/SearchBar.svelte';
	import CPUForm from '$lib/components/CPUForm.svelte';
	import BackupForm from '$lib/components/BackupForm.svelte';
	import PerifericoForm from '$lib/components/PerifericoForm.svelte';
	import ReportanteForm from '$lib/components/ReportanteForm.svelte';
	import FinalButtons from '$lib/components/FinalButtons.svelte';
	import CPUReplacementForm from '$lib/components/CPUBackupForm.svelte';
	import PerifericoReplacementForm from '$lib/components/PerifericoBackupForm.svelte';
	import { reportanteStore } from '$lib/stores/reportanteStore';

	import { enviarDatosASheets } from '$lib/services/sheetsSender';
	import { generarFicha } from '$lib/services/docGenerator';
	import { recibirBusquedaHandler } from '$lib/services/recibirBusqueda';
	import { notifyError, notifySuccess, notifyInfo } from '$lib/services/notyf';

	import { decisionStore } from '$lib/stores/decisionStore';
	import { stepStore } from '$lib/stores/stepStore';
	import { resetAllStores } from '$lib/stores/resetStores';
	import { get } from 'svelte/store';
	import type { ReportData } from '$lib/types/report';
	import type { SvelteComponent } from 'svelte';
	import { initialReportData } from '$lib/constants/initialReportData';
	import { onMount } from 'svelte';
	import { getFolio } from '$lib/services/folio';

	import { validarPaso4, validarPaso6 } from '$lib/utils/validaciones';

	let step = get(stepStore);
	const decisionData = get(decisionStore);

	let loadingSearch = false;
	let loadingSheets = false;
	let ticket_id: number | null = null;
	let cargandoFolio = true;
	let sidebarOpen = false;

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

	function validarDecisionFinal(): boolean {
		const { selected_decision, other_description } = get(decisionStore);

		if (selected_decision === 'other') {
			const desc = other_description ?? '';

			if (desc.trim() !== desc) {
				notifyError('La descripción no debe tener espacios al inicio o al final.');
				return false;
			}

			const regex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]+$/;
			if (!regex.test(desc)) {
				notifyError('La descripción contiene caracteres no permitidos.');
				return false;
			}
		}
		return true;
	}

	function guardarPasoActual() {
		cpuForm?.enviarDatos?.();
		perifericoRef?.enviarDatos?.();
		if (esReemplazo) {
			cpuReplacementRef?.enviarDatos?.();
			perifericoReplacementRef?.enviarDatos?.();
		}
	}

	async function next() {
		switch (step) {
			case 1:
				if (reportanteRef) {
					const ok = await reportanteRef.enviarDatos();
					if (!ok) return;
				}
				break;
			case 2:
				if (cpuForm) {
					const ok = cpuForm.enviarDatos?.();
					if (!ok) return;
				}
				break;
			case 3:
				if (perifericoRef) {
					const ok = perifericoRef.enviarDatos?.();
					if (!ok) return;
				}
				break;
			case 4:
				if (backupRef) {
					const ok = backupRef.enviarDatos?.();
					if (!ok) return;
				}
				break;
			case 5:
				if (cpuReplacementRef) {
					const ok = cpuReplacementRef.enviarDatos?.();
					if (!ok) return;
				}
				break;
			case 6:
				if (perifericoReplacementRef) {
					const ok = perifericoReplacementRef.enviarDatos?.();
					if (!ok) return;
				}
				break;
		}
		if (step < totalSteps) step++;
	}

	function prev() {
		if (step > 1) step--;
	}

	async function goTo(num: number) {
		if (num < step) {
			step = num;
			return;
		}
		await next();
		step = num;
	}

	async function recibirBusqueda(e: CustomEvent<{ tipo: string; codigo: string; form: string }>) {
		const { tipo, form } = e.detail;

		const pasoValido = step === 2 || step === 3 || (esReemplazo && (step === 5 || step === 6));
		if (!pasoValido) {
			notifyError(
				'Para realizar una búsqueda debes estar en el Paso 2 o el paso correspondiente al componente.'
			);
			return;
		}

		if (esReemplazo && (step === 5 || step === 6) && tipo !== '4') {
			notifyInfo(
				`Estás en el paso ${step} (Reemplazo). Para completar estos datos debes cambiar el select a "Entrada".`
			);
			return;
		}

		if (!esReemplazo && (step === 2 || step === 3) && tipo === '4') {
			notifyInfo(`No puedes buscar con "Entrada" en este paso. Cambia el select a "Salida".`);
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
		guardarPasoActual();

		if (!validarDecisionFinal()) return;

		if ((step === 4 && !validarPaso4()) || (step === 6 && !validarPaso6())) return;

		const { selected_decision, other_description } = get(decisionStore);

		if (!selected_decision.trim()) {
			notifyError('Debe seleccionar una decisión antes de generar el Word.');
			return;
		}
		if (selected_decision === 'other' && !other_description.trim()) {
			notifyError('Debe describir la decisión antes de generar el Word.');
			return;
		}

		const datosReportante = get(reportanteStore);
		reportData = { ...reportData, ...datosReportante };
		generarFicha(reportData);
		wordGenerado = true;
	}

	async function confirmarEnvio() {
		guardarPasoActual();

		if (!validarDecisionFinal()) return;

		if ((step === 4 && !validarPaso4()) || (step === 6 && !validarPaso6())) return;

		mostrarPopup = false;
		loadingSheets = true;

		try {
			await enviarDatosASheets(reportData);
			notifySuccess('Datos enviados correctamente');

			resetAllStores();
			reportData = { ...initialReportData, selected_decision: '' };
			wordGenerado = false;
			step = 1;
			ticket_id = await getFolio();
			reportData.ticket_id = ticket_id;
		} catch (err) {
			console.error(err);
		} finally {
			loadingSheets = false;
		}
	}

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
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

<div>
	<div class="container-head">
		<div class="head-left">
			<img src="/logo_resize.webp" alt="logo" />

			<button class="hamburger" on:click={toggleSidebar} aria-label="Abrir menú">
				<i class="fa-solid fa-bars"></i>
			</button>
		</div>

		<header class="head-search">
			<SearchBar on:buscar={recibirBusqueda} loading={loadingSearch} />
		</header>
	</div>

	<div class="layout">
		<!-- Sidebar -->
		<div class="sidebar {sidebarOpen ? 'open' : ''}">
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
		{#if sidebarOpen}
			<button
				class="sidebar-overlay"
				aria-label="Cerrar sidebar"
				on:click={() => (sidebarOpen = false)}
			></button>
		{/if}
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
</div>

<style>
	.container-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: white;
		padding: 5px;
	}

	.layout {
		display: flex;
		min-height: 100vh;
		flex-direction: row;
		width: 100%;
	}

	.sidebar {
		width: 260px;
		background: #0e2239;
		padding: 25px 20px;
		color: white;
		transition: transform 0.3s ease-in-out;
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
		width: 100%;
		max-width: 900px;
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

	.menu-item.active .icon-circle,
	.menu-item:hover .icon-circle {
		background: green;
	}

	.popup {
		background: #ffffff;
		padding: 24px 28px;
		border-radius: 14px;
		width: 380px;
		max-width: 90%;
		text-align: center;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
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
	}

	.popup-buttons {
		margin-top: 22px;
		display: flex;
		gap: 12px;
		justify-content: center;
		flex-wrap: wrap;
	}

	.popup-buttons .confirm,
	.popup-buttons .cancel {
		padding: 9px 18px;
		border-radius: 8px;
		font-size: 15px;
		min-width: 110px;
		color: white;
		transition: transform 0.15s;
	}

	.confirm {
		background: #2a8f2a;
	}
	.cancel {
		background: #999;
	}

	.confirm:hover,
	.cancel:hover {
		transform: scale(1.05);
	}

	.hamburger {
		display: none;
		background: none;
		border: none;
		font-size: 28px;
		cursor: pointer;
		color: #0e2239;
	}

	@media (max-width: 850px) {
		.layout {
			flex-direction: column;
		}

		.sidebar {
			position: fixed;
			top: 0;
			left: 0;
			width: 250px;
			height: 100vh;
			transform: translateX(-100%);
			z-index: 999;
		}

		.sidebar.open {
			transform: translateX(0);
		}

		.sidebar-overlay {
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.4);
			border: none;
			padding: 0;
			cursor: pointer;
		}

		.hamburger {
			display: block;
		}

		.content {
			padding: 15px 10px;
		}
	}

	@media (max-width: 600px) {
		.form-card {
			padding: 20px;
			border-radius: 8px;
		}

		h2 {
			font-size: 1.3rem;
		}

		.nav-buttons {
			flex-direction: column;
			gap: 10px;
		}

		.nav-buttons .btn {
			width: 100%;
		}
	}

	@media (max-width: 450px) {
		.popup {
			width: 95%;
			padding: 18px;
			border-radius: 12px;
		}

		.popup-buttons {
			flex-direction: column;
		}

		.popup-buttons button {
			width: 100%;
		}
	}

	@media (min-width: 300px) and (max-width: 621px) {
		.container-head {
			flex-direction: column;
			gap: 10px;
		}
		.form-card {
			padding: 12px;
		}

		h2 {
			font-size: 1.1rem;
		}

		.sidebar {
			width: 200px;
		}

		.sidebar ul li {
			padding: 8px 10px;
			font-size: 0.85rem;
		}

		.content,
		p {
			font-size: 0.85rem;
		}

		.nav-buttons {
			flex-direction: column;
			width: 100%;
			gap: 6px;
		}

		.nav-buttons .btn {
			padding: 8px;
			font-size: 0.85rem;
			width: 100%;
		}

		.popup {
			width: 92%;
			padding: 14px;
		}

		.popup-buttons {
			flex-direction: column;
			gap: 6px;
		}

		.popup-buttons button {
			width: 100%;
			font-size: 0.85rem;
			padding: 8px;
		}

		.container-head {
			flex-direction: column;
			gap: 6px;
		}

		.hamburger {
			font-size: 20px;
			padding: 6px 8px;
		}
	}
</style>
