<script lang="ts">
  export let label: string = "";
  export let type: string = "text";
  export let placeholder: string = "";
  export let value: string = "";
  export let error: string | null = null;
  export let required: boolean = false;
</script>

<div class="field">
  {#if label}
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label class="label">
      {label} {required ? "*" : ""}
    </label>
  {/if}

  <input
    class:error={!!error}
    type={type}
    placeholder={placeholder}
    bind:value
    required={required}
  />

  {#if error}
    <p class="error-text">{error}</p>
  {/if}
</div>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 16px;
  }

  .label {
    font-weight: 600;
    font-size: 0.95rem;
  }

  input {
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s;
  }

  input:focus {
    border-color: #0077ff;
  }

  input.error {
    border-color: #ff3b3b;
  }

  .error-text {
    font-size: 0.8rem;
    color: #ff3b3b;
  }
</style>
