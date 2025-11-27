<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let loading = false; // <--- NUEVO

	const dispatch = createEventDispatcher();

	let codigo = '';
	let form = '1';
	let tipo = '3';

	function buscar() {
		if (!codigo.trim() || loading) return;

		// lanzamos el evento
		dispatch('buscar', { tipo, codigo, form });
	}
</script>

<div class="search-container">
	<div>
		<input class="input" type="text" placeholder="Código" bind:value={codigo} />
	</div>

	<div class="radios">
		<label>
			<input type="radio" bind:group={form} value="1" />
			Código patrimonial
		</label>

		<label>
			<input type="radio" bind:group={form} value="2" />
			Serie
		</label>
	</div>

	<select bind:value={tipo} class="select">
		<option value="3">Salida</option>
		<option value="4">Entrada</option>
	</select>

	<button class="btn" on:click={buscar} disabled={loading}>
		{#if loading}
			<div class="spinner"></div>
		{:else}
			Buscar
		{/if}
	</button>
</div>

<style>
	.search-container {
		display: flex;
		gap: 10px;
		align-items: center;
		padding: 10px 0;
		flex-wrap: wrap;
		justify-content: center;
	}

	.radios {
		display: flex;
		gap: 12px;
	}

	.radios label {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 0.9rem;
	}

	.select,
	.input {
		padding: 8px 10px;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: 0.95rem;
	}

	.input {
		min-width: 230px;
		flex: 1;
	}

	.btn {
		padding: 8px 12px;
		background: #0077ff;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.95rem;
	}

	.btn:hover {
		background: #005fcc;
	}
	.btn {
		padding: 8px 12px;
		background: #0077ff;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.95rem;
		min-width: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 3px solid white;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
