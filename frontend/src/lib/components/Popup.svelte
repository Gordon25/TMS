<!-- Popup.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from 'svelte/transition';
  export let message: String = "";
  export let success:boolean;
  let isVisible: boolean;
  // false;
 
  const timeout = 1500
  // Function to show the popup and auto-hide it after a delay
  function showPopup() {
    isVisible = true
    // Hide popup after 3 seconds
    setTimeout(() => {
      isVisible = false;
    }, timeout);
  }

  onMount(()=>{
    showPopup();
  })
</script>

{#if isVisible}
<div class="popup" class:success={success} >
  <strong>{message}</strong>
</div>
{/if}

<style>
  .popup {
    color: #e00b0b;
    background-color: transparent;
    padding: 3px;
    border-radius: 5px;
    position: relative;
    z-index: 100;
    margin: auto; /* Center modal content */
  }
  .success {
    color: #28a745;
  }
</style>