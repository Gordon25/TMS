<script lang='ts'>
  import { goto, invalidate, invalidateAll } from "$app/navigation";
  import axios from "axios";
  import type { LayoutData } from "./$types";
  import { PUBLIC_BACKEND_HOSTNAME } from "$env/static/public";
  import { afterUpdate, beforeUpdate, onMount } from "svelte";
  import loginStatus from "$lib/stores/loginStatus"
  import axiosInstance from "$lib/axiosConfig.ts";
  import {AxiosError, type AxiosResponse} from "axios"
  import { isTypeAliasDeclaration } from "typescript";
  export let data:LayoutData
  let errorMessage:String;
  let {token} = data
  const logout = async()=> {
    const responseData = await axiosInstance.get(`/logout`,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )
    const {success} = responseData
    if (success) {
      $loginStatus.isLoggedIn = false
      $loginStatus.isAdmin = false
      goto("/login")
    } else {
      errorMessage = responseData.message
    }
  }

  onMount(async ()=>{
    ({token} = data)
    if (token) {
    $loginStatus.isLoggedIn = true
    const responseData = await axiosInstance.get('/checkIsAdmin',
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )
    const {success} = responseData
    if(success) {
      $loginStatus.isAdmin = responseData.isAdmin
    } else {
      $loginStatus.isAdmin = false
    }
  } else {
    $loginStatus.isLoggedIn = false
    $loginStatus.isAdmin = false
  }  
});

</script>

{#if $loginStatus.isLoggedIn }
<div class="navbar">
    <a href="./tms">Task Management</a>
  {#if $loginStatus.isAdmin }
  <a href="./ums">User Management</a>
  {/if}
  <a href="./profile">Profile</a>
  <button on:click|preventDefault={logout} type="submit">Log Out</button>
</div>
{/if}
{#if !errorMessage}
<slot/>
{:else}
<body>
<div class="error-msg" >
  {errorMessage}
</div>
</body>
{/if}

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

.navbar button {
  margin-right: 40px;
}
body {
  height: 100%;
  margin-top:0;
  display: flex;
  justify-content: center;  /* Horizontally centers the div */
  align-items: center;      /* Vertically centers the div */
}

.error-msg {
  position:absolute;
  top:50%;
  background-color:transparent;
  color:rgb(227, 20, 20);
  font-size: 24px;
}
</style>