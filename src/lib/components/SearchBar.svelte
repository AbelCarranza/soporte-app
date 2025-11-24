<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let codigo = ''; 
	let tipoBusqueda = '1'; 
	let tipo = '3'; 

	function buscar() {
		if (!codigo.trim()) return;

		dispatch('buscar', {
			tipo,
			codigo,
			tipoBusqueda
		});
	}
</script>

<div class="search-container">

	<input class="input" type="text" placeholder="Código" bind:value={codigo} />

	<div class="radios">
		<label>
			<input type="radio" bind:group={tipoBusqueda} value="1" />
			Código patrimonial
		</label>

		<label>
			<input type="radio" bind:group={tipoBusqueda} value="2" />
			Serie
		</label>
	</div>

	<select bind:value={tipo} class="select">
		<option value="3">Salida</option>
		<option value="4">Entrada</option>
	</select>

	<button class="btn" on:click={buscar}> Buscar </button>
</div>

<style>
	.search-container {
		display: flex;
		gap: 10px;
		align-items: center;
		padding: 10px 0;
		flex-wrap: wrap;
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
</style>
