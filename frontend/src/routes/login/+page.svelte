<script lang="ts">
  import axios from "axios";
import { goto, invalidate } from "$app/navigation";
let username = ''
let password = ''
let errorMessage:String;
import {PUBLIC_BACKEND_HOSTNAME} from "$env/static/public"
  import { redirect } from "@sveltejs/kit";
  const login = async (event:Event) => {
    const response = await axios.post(
      `${PUBLIC_BACKEND_HOSTNAME}/login`,
      {
        username,
        password
      },
      {
        withCredentials: true,
      }
    );
    const {success} = response.data
    console.log("COOKIES SET", response.headers.cookie)
    if (success) {
      goto("./tms")
    } else {
      const {message} = response.data
      errorMessage = message
    }
  } 
  $:console.log("Error ", errorMessage)
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
	
 
  <button>Submit</button> 
</form>
</div>
{#if errorMessage}
<div class="error">{errorMessage}</div>
{/if}
</body>

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

.error {
  display: flex;
    margin-top:20px;
    margin-bottom: 8px;
    color: #920;
}

</style>