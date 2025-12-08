<script lang="ts">
	import InputField from './InputField.svelte';
	import { createEventDispatcher } from 'svelte';
	import { decisionStore } from '$lib/stores/decisionStore';
	import { notifyError } from '$lib/services/notyf';
	import { get } from 'svelte/store';

	import type { DecisionData, DecisionOption } from '$lib/types/decision';

	const dispatch = createEventDispatcher<{
		update: { action_plan: string; selected_decision: string };
	}>();

	const stored: DecisionData = get(decisionStore);

	let selected_decision: string = stored.selected_decision ?? '';
	let action_plan: string = stored.action_plan ?? '';
	let other_description: string = stored.other_description ?? '';

	const decisionOptions: DecisionOption[] = [
		{ value: '', label: 'Seleccione una opción', disabled: true },
		{ value: 'Reemplazo con Equipo de Reserva', label: 'Reemplazo con Equipo de Reserva' },
		{ value: 'Reparación en el Lugar', label: 'Reparación en el Lugar' },
		{
			value: 'Retirado para Reparación Externa',
			label: 'Retirado para Reparación Externa'
		},
		{
			value: 'Solo Diagnóstico/Mantenimiento',
			label: 'Solo Diagnóstico/Mantenimiento'
		},
		{ value: 'other', label: 'Otro' }
	];

	// Mostrar/ocultar "Otro"
	let showOtherFields = false;
	$: showOtherFields = selected_decision === 'other';

	// Limpiar texto sin romper si viene null
	function cleanText(value: any): string {
		if (value === null || value === undefined) return '';
		return String(value).replace(/\s+/g, ' ').trim();
	}

	// Regex válidos (letras, números y espacios internos)
	const onlyTextRegex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]+$/;

	function hasInvalidSymbols(value: string): boolean {
		return !onlyTextRegex.test(value);
	}

	// Reactividad segura
	$: {
		if (selected_decision === 'other') {
			action_plan = cleanText(other_description);
		} else if (selected_decision) {
			action_plan = selected_decision;
			other_description = '';
		}
	}

	// Sincronizar con store
	$: decisionStore.set({ selected_decision, action_plan, other_description });

	// Emitir cambios al padre
	$: if (selected_decision || action_plan) {
		dispatch('update', { action_plan, selected_decision });
	}

	export function enviarDatos(): boolean {
		selected_decision = cleanText(selected_decision);

		if (!selected_decision) {
			notifyError('Debe seleccionar una decisión.');
			return false;
		}

		if (selected_decision === 'other') {
			// ⚠️ No usamos cleanText aquí para detectar espacios externos reales
			const raw = other_description ?? '';

			if (raw.trim() !== raw) {
				notifyError('La descripción no debe tener espacios al inicio o al final.');
				return false;
			}

			if (!raw) {
				notifyError("Debe describir la decisión en el campo 'Descripción de la Decisión'.");
				return false;
			}

			if (hasInvalidSymbols(raw)) {
				notifyError('La descripción contiene caracteres no permitidos.');
				return false;
			}

			// Solo si todo está bien, limpiamos
			other_description = cleanText(raw);
			action_plan = other_description;
		}

		dispatch('update', { action_plan, selected_decision });
		return true;
	}
</script>

<div class="form-container">
	<!-- Sección de Decisión -->
	<div class="form-section">
		<h2 class="section-title">Decisión Tomada</h2>
		<div class="form-grid">
			<div class="form-row full-width">
				<div class="select-field">
					<label for="decision-select" class="field-label"> Tipo de Decisión </label>
					<select
						id="decision-select"
						bind:value={selected_decision}
						class="decision-select"
						required
					>
						{#each decisionOptions as option}
							<option value={option.value} disabled={option.disabled}>
								{option.label}
							</option>
						{/each}
					</select>
				</div>
			</div>
		</div>
	</div>

	<!-- Sección de Otro -->
	{#if showOtherFields}
		<div class="form-section conditional-section">
			<h2 class="section-title">
				<span class="icon">📋</span>
				Otra Decisión
			</h2>
			<div class="form-grid">
				<div class="form-row full-width">
					<InputField
						label="Descripción de la Decisión"
						bind:value={other_description}
						placeholder="Describa la decisión tomada..."
						required
					/>
				</div>
			</div>
		</div>
	{/if}
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

	.conditional-section {
		border-left: 4px solid #4299e1;
		animation: fadeIn 0.3s ease-in-out;
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
		gap: 20px;
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

	.select-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.field-label {
		font-weight: 600;
		color: #2d3748;
		font-size: 0.95rem;
	}

	.decision-select {
		padding: 12px 16px;
		border: 2px solid #e2e8f0;
		border-radius: 8px;
		font-size: 1rem;
		background: #ffffff;
		color: #2d3748;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.decision-select:focus {
		outline: none;
		border-color: #4299e1;
		box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
	}

	.decision-select:hover {
		border-color: #cbd5e0;
	}

	.decision-select:invalid {
		color: #a0aec0;
	}

	.section-title:focus {
		outline: 2px solid #4299e1;
		outline-offset: 2px;
		border-radius: 4px;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.input-field) {
		margin-bottom: 0;
	}

	@media (max-width: 768px) {
		.form-container {
			padding: 16px;
			margin: 8px;
		}

		.form-section {
			padding: 16px;
			margin-bottom: 20px;
		}

		.form-row {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		.section-title {
			font-size: 1.1rem;
		}

		.decision-select {
			padding: 10px 14px;
			font-size: 0.95rem;
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

		.form-grid {
			gap: 16px;
		}

		.section-title {
			font-size: 1rem;
			gap: 8px;
		}

		.icon {
			font-size: 1.3rem;
		}
	}

	@media (max-width: 350px) {
		.form-container {
			padding: 10px;
			margin: 2px;
		}

		.form-section {
			padding: 12px;
		}

		.section-title {
			font-size: 0.95rem;
			gap: 6px;
			padding-bottom: 8px;
		}

		.icon {
			font-size: 1.2rem;
		}

		.decision-select {
			padding: 8px 10px;
			font-size: 0.85rem;
		}

		.field-label {
			font-size: 0.85rem;
		}

		.form-row {
			grid-template-columns: 1fr !important;
			gap: 12px;
		}

		.select-field {
			gap: 6px;
		}
	}

	@media (max-width: 300px) {
		.form-container {
			padding: 8px;
			margin: 0;
		}

		.form-section {
			padding: 10px;
			border-radius: 6px;
		}

		.section-title {
			font-size: 0.9rem;
			gap: 4px;
			padding-bottom: 6px;
		}

		.icon {
			font-size: 1.1rem;
		}

		.form-grid,
		.form-row {
			gap: 10px !important;
			grid-template-columns: 1fr !important;
		}

		.field-label {
			font-size: 0.8rem;
		}

		.decision-select {
			padding: 8px 8px;
			font-size: 0.8rem;
		}

		.conditional-section {
			padding: 10px;
			border-left-width: 3px;
		}
	}
</style>
