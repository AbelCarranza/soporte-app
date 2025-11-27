<script lang="ts">
	import favicon from '$lib/assets/logo.webp';
	import 'notyf/notyf.min.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
