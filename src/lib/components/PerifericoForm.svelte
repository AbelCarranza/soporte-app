<script lang="ts">
	import InputField from './InputField.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let showMonitor = false;
	let showKeyboard = false;
	let showMouse = false;
	let showOthers = false;

	let monitor_brand = '';
	let monitor_code = '';
	let monitor_serial = '';

	let keyboard_brand = '';
	let keyboard_code = '';
	let keyboard_serial = '';

	let mouse_brand = '';
	let mouse_code = '';
	let mouse_serial = '';

	let other_peripheral = '';

	export function setData(values: any) {
		if (values.monitor_brand || values.monitor_code || values.monitor_serial) {
			showMonitor = true;
			monitor_brand = values.monitor_brand || '';
			monitor_code = values.monitor_code|| '';
			monitor_serial = values.monitor_serial || '';
		}

		if (values.keyboard_brand || values.keyboard_code || values.keyboard_serial) {
			showKeyboard = true;
			
			keyboard_brand = values.keyboard_brand || '';
			keyboard_code = values.keyboard_code || '';
			keyboard_serial = values.keyboard_serial || '';
			console.log(keyboard_code)
		}

		if (values.mouse_brand || values.mouse_code || values.mouse_serial) {
			showMouse = true;
			mouse_brand = values.mouse_brand || '';
			mouse_code = values.mouse_code || '';
			mouse_serial = values.mouse_serial || '';
		}

		if (values.other_peripheral) {
			showOthers = true;
			other_peripheral = values.other_peripheral;
		}
	}

	export function enviarDatos() {
		dispatch('update', {
			monitor_brand,
			monitor_code,
			monitor_serial,
			keyboard_brand,
			keyboard_code,
			keyboard_serial,
			mouse_brand,
			mouse_code,
			mouse_serial,
			other_peripheral
		});
	}
</script>

<div class="form-container">
	<!-- MONITOR -->
	<div class="form-section">
		<label class="section-toggle">
			<input type="checkbox" bind:checked={showMonitor} />
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

	<!-- TECLADO -->
	<div class="form-section">
		<label class="section-toggle">
			<input type="checkbox" bind:checked={showKeyboard} />
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

	<!-- MOUSE -->
	<div class="form-section">
		<label class="section-toggle">
			<input type="checkbox" bind:checked={showMouse} />
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
					<InputField
						label="Código"
						bind:value={mouse_code}
						placeholder="Ej: LOG-M90"
					/>
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

	<!-- OTROS -->
	<div class="form-section">
		<label class="section-toggle">
			<input type="checkbox" bind:checked={showOthers} />
			<span>🔌 Otros periféricos</span>
		</label>

		{#if showOthers}
			<div class="form-grid">
				<div class="form-row full-width">
					<InputField
						label="Descripción de Otros Periféricos"
						bind:value={other_peripheral}
						placeholder="Ej: Webcam Logitech C920, Parlantes, Tableta Wacom..."
					/>
				</div>
			</div>
		{/if}
	</div>
</div>
<style>
	.form-container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 24px;
		background: #ffffff;
		border-radius: 12px;
		box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
	}

	.form-section {
		margin-bottom: 24px;
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

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.form-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 20px;
		align-items: start;
	}

	.form-row.full-width {
		grid-template-columns: 1fr;
	}

	.form-section .form-row {
		margin-bottom: 0;
	}

	.section-toggle {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		user-select: none;
		border-bottom: 2px solid #e2e8f0;
		padding-bottom: 10px;
		margin-bottom: 15px;
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
	}

	/* Efecto sutil al hacer hover en toda la sección */
	.form-section {
		cursor: pointer;
	}
</style>
