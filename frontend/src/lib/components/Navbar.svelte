<script lang='ts'>
  import { onMount } from "svelte";
  import axiosInstance from "../axiosConfig";
  import logout from "../logout";
  import loginStatus from "$lib/stores/loginStatus";
  import { goto } from "$app/navigation";
  export let isAdmin:boolean;
 
</script>


<div class="navbar">
    <a href="./tms">Task Management</a>
  {#if isAdmin === true}
  <a href="./ums">User Management</a>
  {/if}
  <a href="./profile">Profile</a>
  <button on:click|preventDefault={async ()=>{const {success} = await logout();
                                              if (success) {
                                                goto("/login");
                                              }}} type="submit">Log Out</button>
</div>


<style>
  .navbar {
    width: 100%;
    background-color: #f8f8f8;
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    padding: 15px;
    position: fixed; /* Fix the position */
      top: 0; /* Stick to the top */
      left: 0; /* Align to the left */
}

.navbar a {
    color: black;
    padding: 14px 20px;
    text-decoration: none;
    text-align: center;
    font-weight: 500;
}

.navbar a:hover {
    background-color: #ddd;
    color: black;
}

.navbar button {
  margin-right: 40px;
}
</style>