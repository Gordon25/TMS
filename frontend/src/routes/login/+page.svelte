<script lang="ts">
let username = ''
let password = ''
let errorMessage:String|undefined;
import loginStatus from "$lib/stores/loginStatus";
import axiosInstance from "$lib/axiosConfig.ts";
import Popup from "$lib/components/Popup.svelte"
  import type { AxiosError, AxiosResponse } from "axios";

  let success = false;
  const login = async () => {
    // try{
    const responseData = await axiosInstance
    .post(
      '/login',
      {
        username,
        password
      }
    ).then((res:AxiosResponse)=>res.data)
    .catch((err:AxiosError)=>err.response?.data);
    ({success} = responseData)
    if (success) {
      $loginStatus.isLoggedIn = true
      window.location.href = "/tms";
    } else {
      $loginStatus.isLoggedIn = false
      const timeout = 1500
      errorMessage = responseData.message;
      setTimeout(()=>{
        errorMessage= undefined}, timeout)
    }
  // } catch(error ) {
  //   $loginStatus.isLoggedIn = false;
  //   success = false
  //   console.log("ERROR ", error)
  // } finally {
  //   if (success) {
      
  //   }
  // }
}

</script>
<body>
<div class="login-container">
<form class="login-form" method="post" on:submit|preventDefault={login}>
	<label for="username">
		Username
  </label>
	<input type='text' name="username" id="username" bind:value={username} placeholder="Username"/>
	
 
	<label for="password">
		Password
  </label>
	<input type='password' name="password" id="password" bind:value={password} placeholder="Password"/>
	
 
  <button>Log in</button> 
</form>
</div>
</body>

{#if errorMessage}
<div class="error-msg">  
  <Popup message={errorMessage} success={false}/>
</div>
{/if}


<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
    font-family: Arial, sans-serif;
}

.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 200;
}

.login-form {
    background-color: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    width: 300px;
    text-align: center;
}

.login-form label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
}

.login-form input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

.login-form button {
    width: 100%;
    padding: 10px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
}

.error-msg {
  position: absolute;
  margin-top:40px;
  margin-bottom: 8px;
  justify-items: center;
  top:60%;
  left: 45%;
  background-color: #ccc;
}

</style>