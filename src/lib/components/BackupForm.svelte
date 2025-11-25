<script lang="ts">
	import InputField from './InputField.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let selected_decision = '';
	let action_plan = '';
	let other_description = '';

	const decisionOptions = [
		{ value: '', label: 'Seleccione una opción', disabled: true },
		{ value: 'Reemplazo con Equipo de Reserva', label: 'Reemplazo con Equipo de Reserva' },
		{ value: 'Reparación en el Lugar', label: 'Reparación en el Lugar' },
		{ value: 'Retirado para Reparación Externa', label: 'Retirado para Reparación Externa' },
		{ value: 'Solo Diagnóstico/Mantenimiento', label: 'Solo Diagnóstico/Mantenimiento' },
		{ value: 'other', label: 'Otro' }
	];

	// Mostrar campo adicional
	$: showOtherFields = selected_decision === 'other';

	// Lógica de action_plan
	$: {
		if (selected_decision === 'other') {
			action_plan = other_description;
		} else if (selected_decision) {
			action_plan = selected_decision;
			other_description = '';
		}
	}

	// 🔥 Emitir cambios solo cuando haya valores relevantes
	$: if (selected_decision !== '' || action_plan !== '') {
		dispatch('update', {
			action_plan,
			selected_decision
		});
	}

	// Para cuando se hace click en "Siguiente"
	export function enviarDatos() {
		dispatch('update', {
			action_plan,
			selected_decision
		});
	}
</script>

<div class="form-container">
	<!-- Sección de Decisión -->
	<div class="form-section">
		<h2 class="section-title">
			<span class="icon">✅</span>
			Decisión Tomada
		</h2>
		<div class="form-grid">
			<div class="form-row full-width">
				<div class="select-field">
					<label for="decision-select" class="field-label">
						Tipo de Decisión <span class="required">*</span>
					</label>
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

	/* Estilos para el select personalizado */
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

	.required {
		color: #e53e3e;
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

	/* Animación para las secciones condicionales */
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

	/* Estilos específicos para mejorar la jerarquía visual */
	:global(.input-field) {
		margin-bottom: 0;
	}

	/* Responsive */
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

	/* Mejoras de accesibilidad */
	.section-title:focus {
		outline: 2px solid #4299e1;
		outline-offset: 2px;
		border-radius: 4px;
	}
</style>
