<script lang="ts">
  import type { ActionData } from "./$types";
  export let form:ActionData;

</script>
<body>
<div class="login-container">
<form class="login-form" method="post" action="?/login">
	<label for="username">
		Username
	<input type='text' name="username" id="username" placeholder="Username"/>
	</label>
 
	<label for="password">
		Password
	<input type='password' name="password" id="password" placeholder="Password"/>
	</label>
 
  <button>Submit</button> 
  {#if form&&!form?.success}
  <p class="error">{form?.errorMessage}</p>
  {/if}
  

</form>
</div>
</body>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    display: flex;
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
    height: 100%;
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
  display: block;
    margin-top:20px;
    margin-bottom: 8px;
    color: #920;
}

</style>