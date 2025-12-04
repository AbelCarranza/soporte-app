<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { BuscarEventDetail } from '$lib/types/events';

	export let loading = false;

	const dispatch = createEventDispatcher<{ buscar: BuscarEventDetail }>();

	let codigo = '';
	let form = '1';
	let tipo = '3';

	function buscar(): void {
		if (!codigo.trim() || loading) return;
		dispatch('buscar', { tipo, codigo, form });
	}
</script>

<div class="search-container">
	<div class="search-wrapper">
		<i class="fa fa-search"></i>
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

	.search-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-wrapper i {
		position: absolute;
		left: 10px;
		font-size: 14px;
		color: #666;
	}

	.search-wrapper .input {
		padding-left: 32px;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	@media (max-width: 600px) {
		.search-container {
			justify-content: center;
			gap: 12px;
		}

		.radios {
			width: 100%;
			justify-content: center;
		}

		.select {
			width: 100%;
		}

		.btn {
			width: 100%;
		}
	}

	@media (max-width: 400px) {
		.input {
			min-width: 100%;
		}

		.select {
			font-size: 0.9rem;
		}

		.radios {
			gap: 6px;
			text-align: center;
		}

		.radios label {
			justify-content: center;
		}

		.btn {
			padding: 10px;
			font-size: 0.9rem;
		}
	}

	@media (max-width: 350px) {
		.search-wrapper i {
			left: 8px;
			font-size: 12px;
		}

		.search-wrapper .input {
			padding-left: 28px;
			font-size: 0.9rem;
		}

		.radios label {
			font-size: 0.85rem;
		}

		.select,
		.input {
			padding: 6px 8px;
			font-size: 0.9rem;
		}

		.btn {
			padding: 8px;
			font-size: 0.9rem;
		}
	}

	@media (max-width: 300px) {

		.search-container {
			gap: 8px;
			padding: 8px 0;
		}


		.search-wrapper .input {
			width: 100%;
			min-width: unset;
			padding-left: 26px;
			font-size: 0.85rem;
		}

		.search-wrapper i {
			left: 6px;
			font-size: 11px;
		}

		.radios {
			flex-direction: column;
			align-items: center;
			gap: 4px;
			width: 100%;
		}

		.radios label {
			font-size: 0.8rem;
		}


		.select {
			width: 100%;
			font-size: 0.85rem;
			padding: 6px 8px;
		}

		.btn {
			width: 100%;
			padding: 8px;
			font-size: 0.85rem;
		}

		.spinner {
			width: 14px;
			height: 14px;
			border-width: 2px;
		}
	}
</style>
