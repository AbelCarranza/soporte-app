<script lang="ts">
  import InputField from './InputField.svelte';
  import { createEventDispatcher } from 'svelte';
  import { reportanteStore } from '$lib/stores/reportanteStore';
  import type { ReportanteData } from '$lib/stores/reportanteStore';
  import { get } from 'svelte/store';

  const dispatch = createEventDispatcher();

  export let reported_by = '';
  export let location = '';
  export let technician = '';
  let issue_date = '';

  // Inicializar desde store
  $: {
    const data: ReportanteData = get(reportanteStore);
    reported_by = data.reported_by ?? '';
    location = data.location ?? '';
    technician = data.technician ?? '';
    issue_date = data.issue_date ?? '';
  }

  function generarFecha() {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();

    issue_date = `${dia}-${mes}-${anio}`;
	
  }

  export function setData(values: any) {
    reportanteStore.update((current) => ({
      ...current,
      location: values.Location ?? current.location
    }));
  }

  export function enviarDatos() {
	generarFecha();
    dispatch('update', {
      reported_by,
      location,
      technician,
      issue_date
    });
  }
</script>

<div class="form-container">
	<div class="centered-layout">
		<!-- Sección de Información del Reporte -->
		<div class="form-section main-info">
			<h2 class="section-title">
				<span class="icon">👤</span>
				Información del Reporte
			</h2>
			<div class="form-grid">
				<div class="form-row">
					<InputField
						label="Persona que Reporta"
						bind:value={reported_by}
						placeholder="Ej: Juan Pérez González"
						required
					/>
				</div>
				<div class="form-row">
					<InputField
						label="Ubicación"
						bind:value={location}
						placeholder="Ej: Oficina 304, Piso 3, Área de Sistemas"
						required
					/>
				</div>
				<div class="form-row">
					<InputField
						label="Técnico Responsable"
						bind:value={technician}
						placeholder="Ej: Carlos Rodríguez - Departamento de TI"
						required
					/>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.form-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 24px;
		border-radius: 12px;
	}

	.centered-layout {
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	.form-section {
		width: 100%;
		max-width: 600px;
		padding: 32px;
		background: #f8fafc;
		border-radius: 12px;
		border: 1px solid #e2e8f0;
		transition: all 0.3s ease;
	}

	.form-section:hover {
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
		border-color: #cbd5e0;
		transform: translateY(-2px);
	}

	.section-title {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		margin: 0 0 28px 0;
		color: #2d3748;
		font-size: 1.5rem;
		font-weight: 600;
		border-bottom: 2px solid #e2e8f0;
		padding-bottom: 16px;
		text-align: center;
	}

	.icon {
		font-size: 1.8rem;
	}

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr;
		gap: 20px;
		align-items: start;
	}

	/* Efectos visuales mejorados */
	.form-section {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Estados de focus para mejor accesibilidad */
	:global(.input-field:focus-within) {
		transform: translateY(-1px);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.form-container {
			padding: 16px;
			margin: 8px;
			max-width: none;
		}

		.form-section {
			padding: 24px 20px;
			max-width: none;
		}

		.section-title {
			font-size: 1.3rem;
			margin-bottom: 24px;
		}

		.icon {
			font-size: 1.6rem;
		}

		.form-grid {
			gap: 20px;
		}

		.form-row {
			gap: 16px;
		}
	}

	@media (max-width: 480px) {
		.form-container {
			padding: 12px;
			margin: 4px;
		}

		.form-section {
			padding: 20px 16px;
		}

		.section-title {
			font-size: 1.2rem;
			gap: 10px;
			padding-bottom: 14px;
		}

		.icon {
			font-size: 1.5rem;
		}

		.form-grid {
			gap: 18px;
		}

		.form-row {
			gap: 14px;
		}
	}

	/* Mejoras de accesibilidad */
	.section-title:focus {
		outline: 2px solid #4299e1;
		outline-offset: 2px;
		border-radius: 4px;
	}

	/* Centrado perfecto para todos los dispositivos */
	.centered-layout {
		min-height: auto;
	}
</style>
