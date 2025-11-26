<script lang="ts">
	import InputField from './InputField.svelte';
	import { createEventDispatcher } from 'svelte';
    import { backupPerifericoStore } from '$lib/stores/backupPerifericoStore';


	const dispatch = createEventDispatcher();

	let showMonitor = false;
	let showKeyboard = false;
	let showMouse = false;
	let showOthers = false;

	// Nuevos valores BACKUP
	let bk_monitor = '';
	let bk_mon_code = '';
	let bk_mon_serial = '';

	let bk_keyboard = '';
	let bk_key_code = '';
	let bk_key_serial = '';

	let bk_mouse = '';
	let bk_mouse_code = '';
	let bk_mouse_serial = '';


	backupPerifericoStore.subscribe((data: any) => {
		showMonitor = data.showMonitor ?? false;
		showKeyboard = data.showKeyboard ?? false;
		showMouse = data.showMouse ?? false;
		showOthers = data.showOthers ?? false;

		bk_monitor = data.bk_monitor ?? '';
		bk_mon_code = data.bk_mon_code ?? '';
		bk_mon_serial = data.bk_mon_serial ?? '';

		bk_keyboard = data.bk_keyboard ?? '';
		bk_key_code = data.bk_key_code ?? '';
		bk_key_serial = data.bk_key_serial ?? '';

		bk_mouse = data.bk_mouse ?? '';
		bk_mouse_code = data.bk_mouse_code ?? '';
		bk_mouse_serial = data.bk_mouse_serial ?? '';

	});

	export function setData(values: any) {
		backupPerifericoStore.update((current) => ({
			...current,

			showMonitor: !!(values.bk_monitor || values.bk_mon_code || values.bk_mon_serial),
			showKeyboard: !!(values.bk_keyboard || values.bk_key_code || values.bk_key_serial),
			showMouse: !!(values.bk_mouse || values.bk_mouse_code || values.bk_mouse_serial),

			bk_monitor: values.bk_monitor ?? current.bk_monitor,
			bk_mon_code: values.bk_mon_code ?? current.bk_mon_code,
			bk_mon_serial: values.bk_mon_serial ?? current.bk_mon_serial,

			bk_keyboard: values.bk_keyboard ?? current.bk_keyboard,
			bk_key_code: values.bk_key_code ?? current.bk_key_code,
			bk_key_serial: values.bk_key_serial ?? current.bk_key_serial,

			bk_mouse: values.bk_mouse ?? current.bk_mouse,
			bk_mouse_code: values.bk_mouse_code ?? current.bk_mouse_code,
			bk_mouse_serial: values.bk_mouse_serial ?? current.bk_mouse_serial,

		}));
	}

	export function enviarDatos() {
		console.log(bk_monitor)
		dispatch('update', {
			bk_monitor,
			bk_mon_code,
			bk_mon_serial,
			bk_keyboard,
			bk_key_code,
			bk_key_serial,
			bk_mouse,
			bk_mouse_code,
			bk_mouse_serial,
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
					<InputField label="Marca y/o Modelo" bind:value={bk_monitor} />
					<InputField label="Código" bind:value={bk_mon_code} />
					<InputField label="Número de Serie" bind:value={bk_mon_serial} />
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
					<InputField label="Marca y/o Modelo" bind:value={bk_keyboard} />
					<InputField label="Código" bind:value={bk_key_code} />
					<InputField label="Serie" bind:value={bk_key_serial} />
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
					<InputField label="Marca y/o Modelo" bind:value={bk_mouse} />
					<InputField label="Código" bind:value={bk_mouse_code} />
					<InputField label="Serie" bind:value={bk_mouse_serial} />
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
		border-radius: 12px;
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

	.form-section {
		cursor: pointer;
	}
</style>
