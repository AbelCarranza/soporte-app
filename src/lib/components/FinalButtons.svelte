<script lang="ts">
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	function generarWord() {
		dispatch("generarWord");
	}

	function enviarSheets() {
		dispatch("enviarSheets");
	}
</script>

<div class="final-buttons">
	<button class="btn word" on:click={generarWord}>
		Generar Word
	</button>

	<button class="btn sheets" on:click={enviarSheets}>
		Enviar a Google Sheets
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
</style>
