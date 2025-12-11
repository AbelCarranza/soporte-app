<script lang="ts">
	import InputField from './InputField.svelte';
	import { createEventDispatcher } from 'svelte';
	import { perifericoStore } from '$lib/stores/perifericoStore';
	import type { PerifericoData, SetPerifericoValues } from '$lib/types/PerifericoData';
	import { validatePerifericos } from '$lib/utils/perifericoValidator';

	const dispatch = createEventDispatcher<{ update: PerifericoData }>();

	let showMonitor = false;
	let showKeyboard = false;
	let showMouse = false;

	let monitor_brand = '';
	let monitor_code = '';
	let monitor_serial = '';

	let keyboard_brand = '';
	let keyboard_code = '';
	let keyboard_serial = '';

	let mouse_brand = '';
	let mouse_code = '';
	let mouse_serial = '';

	let observations = '';

	perifericoStore.subscribe((data: PerifericoData) => {
		showMonitor = data.showMonitor ?? false;
		showKeyboard = data.showKeyboard ?? false;
		showMouse = data.showMouse ?? false;

		monitor_brand = data.monitor_brand ?? '';
		monitor_code = data.monitor_code ?? '';
		monitor_serial = data.monitor_serial ?? '';

		keyboard_brand = data.keyboard_brand ?? '';
		keyboard_code = data.keyboard_code ?? '';
		keyboard_serial = data.keyboard_serial ?? '';

		mouse_brand = data.mouse_brand ?? '';
		mouse_code = data.mouse_code ?? '';
		mouse_serial = data.mouse_serial ?? '';

		observations = data.observations ?? '';
	});

	$: perifericoStore.update((d) => ({
		...d,
		showMonitor,
		showKeyboard,
		showMouse
	}));

	$: if (!showMonitor) resetMonitor();
	$: if (!showKeyboard) resetKeyboard();
	$: if (!showMouse) resetMouse();

	function resetMonitor() {
		monitor_brand = '';
		monitor_code = '';
		monitor_serial = '';
		perifericoStore.update((v) => ({
			...v,
			monitor_brand: '',
			monitor_code: '',
			monitor_serial: ''
		}));
	}

	function resetKeyboard() {
		keyboard_brand = '';
		keyboard_code = '';
		keyboard_serial = '';
		perifericoStore.update((v) => ({
			...v,
			keyboard_brand: '',
			keyboard_code: '',
			keyboard_serial: ''
		}));
	}

	function resetMouse() {
		mouse_brand = '';
		mouse_code = '';
		mouse_serial = '';
		perifericoStore.update((v) => ({
			...v,
			mouse_brand: '',
			mouse_code: '',
			mouse_serial: ''
		}));
	}

	export function setData(values: SetPerifericoValues): void {
		perifericoStore.update((current) => ({
			...current,

			showMonitor:
				values.monitor_brand || values.monitor_code || values.monitor_serial
					? true
					: current.showMonitor,

			showKeyboard:
				values.keyboard_brand || values.keyboard_code || values.keyboard_serial
					? true
					: current.showKeyboard,

			showMouse:
				values.mouse_brand || values.mouse_code || values.mouse_serial ? true : current.showMouse,

			showOthers: values.observations ? true : current.showOthers,

			monitor_brand: values.monitor_brand ?? current.monitor_brand,
			monitor_code: values.monitor_code ?? current.monitor_code,
			monitor_serial: values.monitor_serial ?? current.monitor_serial,

			keyboard_brand: values.keyboard_brand ?? current.keyboard_brand,
			keyboard_code: values.keyboard_code ?? current.keyboard_code,
			keyboard_serial: values.keyboard_serial ?? current.keyboard_serial,

			mouse_brand: values.mouse_brand ?? current.mouse_brand,
			mouse_code: values.mouse_code ?? current.mouse_code,
			mouse_serial: values.mouse_serial ?? current.mouse_serial,

			observations: values.observations ?? current.observations
		}));
	}

	export function enviarDatos(): boolean {
		const fields = {
			showMonitor,
			showKeyboard,
			showMouse,

			monitor_brand,
			monitor_code,
			monitor_serial,

			keyboard_brand,
			keyboard_code,
			keyboard_serial,

			mouse_brand,
			mouse_code,
			mouse_serial,

			observations
		};

		const isValid = validatePerifericos(
			fields,
			{
				monitor: {
					brand: 'monitor_brand',
					code: 'monitor_code',
					serial: 'monitor_serial'
				},
				keyboard: {
					brand: 'keyboard_brand',
					code: 'keyboard_code',
					serial: 'keyboard_serial'
				},
				mouse: {
					brand: 'mouse_brand',
					code: 'mouse_code',
					serial: 'mouse_serial'
				},
				observations: 'observations'
			},
			{
				monitor: showMonitor,
				keyboard: showKeyboard,
				mouse: showMouse
			}
		);

		if (!isValid) {
			if (!showMonitor && !showKeyboard && !showMouse) {
				perifericoStore.set({
					showMonitor: false,
					showKeyboard: false,
					showMouse: false,
					showOthers: false,
					monitor_brand: '',
					monitor_code: '',
					monitor_serial: '',
					keyboard_brand: '',
					keyboard_code: '',
					keyboard_serial: '',
					mouse_brand: '',
					mouse_code: '',
					mouse_serial: '',
					observations: ''
				});
			}
			return false;
		}

		perifericoStore.update((current) => ({ ...current, ...fields }));
		dispatch('update', fields);
		return true;
	}

	export function getCurrentState() {
		return {
			showMonitor,
			showKeyboard,
			showMouse
		};
	}
</script>

<div class="form-container">
	<div class="form-section">
		<label class="section-toggle">
			<input type="checkbox" bind:checked={showMonitor} on:change={resetMonitor} />
			<span>🖥️ Monitor</span>
		</label>

		{#if showMonitor}
			<div class="form-grid">
				<div class="form-row">
					<InputField
						label="Marca y/o Modelo"
						bind:value={monitor_brand}
						placeholder="Ej: Dell P2419H, LG 24MK400H"
						required
					/>
					<InputField
						label="Código"
						bind:value={monitor_code}
						placeholder="Ej: DEL-P2419H"
						required
					/>
					<InputField
						label="Número de Serie"
						bind:value={monitor_serial}
						placeholder="Ej: CN-0PK4C6-64125-2AO-1E3G"
						required
					/>
				</div>
			</div>
		{/if}
	</div>

	<div class="form-section">
		<label class="section-toggle">
			<input type="checkbox" bind:checked={showKeyboard} on:change={resetKeyboard} />
			<span>⌨️ Teclado</span>
		</label>

		{#if showKeyboard}
			<div class="form-grid">
				<div class="form-row">
					<InputField
						label="Marca y/o Modelo"
						bind:value={keyboard_brand}
						placeholder="Ej: Logitech K120, Dell KB216"
						required
					/>
					<InputField
						label="Código"
						bind:value={keyboard_code}
						placeholder="Ej: LOG-K120"
						required
					/>
					<InputField
						label="Número de Serie"
						bind:value={keyboard_serial}
						placeholder="Ej: 2109A3B4C5D6"
						required
					/>
				</div>
			</div>
		{/if}
	</div>

	<div class="form-section">
		<label class="section-toggle">
			<input type="checkbox" bind:checked={showMouse} on:change={resetMouse} />
			<span>🖱️ Mouse</span>
		</label>

		{#if showMouse}
			<div class="form-grid">
				<div class="form-row">
					<InputField
						label="Marca y/o Modelo"
						bind:value={mouse_brand}
						placeholder="Ej: Logitech M90, Dell MS116"
						required
					/>
					<InputField label="Código" bind:value={mouse_code} placeholder="Ej: LOG-M90" required />
					<InputField
						label="Número de Serie"
						bind:value={mouse_serial}
						placeholder="Ej: 2109X1Y2Z3A4"
						required
					/>
				</div>
			</div>
		{/if}
	</div>
	<div class="form-section">
		<h2 class="section-toggle">
			<span class="icon">📝</span>
			Observaciones
		</h2>
		<div class="form-grid">
			<div class="form-row">
				<InputField
					label="Observaciones"
					bind:value={observations}
					placeholder="Ingrese cualquier observación adicional..."
				/>
			</div>
		</div>
	</div>
</div>

<style>
	.form-container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 24px;
		border-radius: 12px;
	}

	.form-section {
		margin-bottom: 24px;
		padding: 24px;
		background: #f8fafc;
		border-radius: 8px;
		border: 1px solid #e2e8f0;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.form-section:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		border-color: #cbd5e0;
	}

	.form-grid {
		display: flex;
		flex-direction: column;
	}

	.form-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 20px;
	}

	.section-toggle {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 1.1rem;
		font-weight: 600;
		border-bottom: 2px solid #e2e8f0;
		padding-bottom: 10px;
		margin-bottom: 15px;
		user-select: none;
	}

	.section-toggle input {
		transform: scale(1.3);
	}

	@media (max-width: 768px) {
		.form-container {
			padding: 16px;
			margin: 8px;
		}

		.form-section {
			padding: 20px 16px;
			margin-bottom: 20px;
		}

		.form-row {
			grid-template-columns: 1fr;
			gap: 16px;
		}
	}

	@media (max-width: 480px) {
		.form-container {
			padding: 12px;
			margin: 4px;
		}

		.form-section {
			padding: 16px 12px;
		}

		.section-toggle {
			font-size: 1rem;
			gap: 8px;
		}
	}

	@media (max-width: 300px) {
		.form-container {
			padding: 10px;
			margin: 0;
		}

		.form-section {
			padding: 14px 10px;
			border-radius: 6px;
		}

		.section-toggle {
			font-size: 0.9rem;
			gap: 6px;
			padding-bottom: 8px;
		}

		.section-toggle input {
			transform: scale(1.1);
		}

		.form-row {
			grid-template-columns: 1fr;
			gap: 14px;
		}

		.icon {
			font-size: 1rem;
		}
	}
</style>
