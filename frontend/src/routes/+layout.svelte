<script lang='ts'>
  import { goto, invalidate, invalidateAll } from "$app/navigation";
  import axios from "axios";
  import type { LayoutData } from "./$types";
  import { PUBLIC_BACKEND_HOSTNAME } from "$env/static/public";
  import { afterUpdate, onMount } from "svelte";
  export let data:LayoutData;
  import loginStatus from "$lib/stores/loginStatus"
  import axiosInstance from "$lib/axiosConfig";
  let isAdmin = false;
  let isloggedIn = false;
  let token:string|undefined;
  $:{
    isloggedIn = data.isLoggedIn
    isAdmin = data.isAdmin
    token = data.token
  }
  
  $:{console.log("NAVBAR ", data, isloggedIn, isAdmin, data.token, $loginStatus)}
  
  const logout = async()=> {
    
    const response = await axiosInstance.get(`/logout`,{
    headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }  
    )
    const {success} = response.data
    if (success) {
      goto("/login")
    } 
  }

$:{isloggedIn = $loginStatus.isLoggedIn;
  isAdmin = $loginStatus.isAdmin;
}
$:{console.log("LOGGING ", isloggedIn, isAdmin)}
</script>

{#if isloggedIn }
<div class="navbar">
    <a href="./tms">Task Management</a>
  {#if isAdmin }
  <a href="./ums">User Management</a>
  {/if}
  <a href="./profile">Profile</a>
  <button on:click|preventDefault={logout} type="submit">Log Out</button>

</div>
{/if}
<slot/>

<style>
/* Navbar Styling */
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
</style>