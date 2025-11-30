<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let canSend = false;
	export let loadingSheets = false;

	const dispatch = createEventDispatcher();

	function enviarSheets() {
		if (!loadingSheets) {
			dispatch('confirmarEnvioSheets');
		}
	}

	function generarWord() {
		dispatch('generarWord');
	}
</script>

<div class="final-buttons">
	<button class="btn word" on:click={generarWord}> Generar Word </button>

	<button class="btn sheets" on:click={enviarSheets} disabled={!canSend || loadingSheets}>
		{#if loadingSheets}
			<div class="spinner"></div>
			Enviando...
		{:else}
			Enviar a Google Sheets
		{/if}
	</button>
</div>

<style>
	.final-buttons {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 2rem;
	}

	.btn {
		padding: 0.8rem 1.5rem;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		font-weight: 600;
		background: #0070f3;
		color: white;
	}

	.word {
		background: #444;
	}

	.sheets {
		background: #1a8f3c;
	}

	button[disabled] {
		opacity: 0.5;
		cursor: not-allowed;
	}
		button[disabled] {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* SPINNER */
	.spinner {
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-top: 3px solid white;
		border-radius: 50%;
		width: 16px;
		height: 16px;
		animation: spin 0.6s linear infinite;
		display: inline-block;
		margin-right: 6px;
		vertical-align: middle;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
</style>
