<script lang="ts">  
  import type { LayoutData } from "./$types";
  import { beforeUpdate } from "svelte";
  import loginStatus from "$lib/stores/loginStatus";
  import Navbar from "$lib/components/Navbar.svelte";
  
  export let data: LayoutData;
  let errorMessage: string | null = null; // Use nullable type for error message


  beforeUpdate(()=> {
    if (data) { 
      $loginStatus.isLoggedIn = data.isLoggedIn;
      $loginStatus.isAdmin = data.isAdmin;
    }
  }
)
</script>

<div>
  {#if errorMessage}
  <div class="error-msg">
    {errorMessage}
  </div>
  {:else}
  {#if $loginStatus.isLoggedIn===true}
    <Navbar isAdmin={$loginStatus.isAdmin} />
  {/if}
  <slot />
  {/if}
</div>

<style>
/* Navbar Styling */
body {
  height: 100%;
  margin-top: 0;
  display: flex;
  justify-content: center;  /* Horizontally centers the div */
  align-items: center;      /* Vertically centers the div */
}

.error-msg {
  position: absolute;
  top: 50%;
  background-color: transparent;
  color: rgb(227, 20, 20);
  font-size: 24px;
}
</style>
