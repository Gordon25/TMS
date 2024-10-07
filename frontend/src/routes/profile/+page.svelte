<script lang='ts'>
  import { invalidateAll } from "$app/navigation";
  import type { PageServerData, ActionData } from "./$types";
  import Popup from "$lib/components/Popup.svelte";
  import { onMount } from "svelte";
  export let data:PageServerData;
  export let form:ActionData
  let username ="";
  let email="";
  let pageError=""
  let success:boolean;

  let newEmail = "";
  let newPassword = "";

onMount(()=>{
    success = data.success
    if (success) {
    username = data.username;
    email = data.email;
    } else {
    pageError = data.message;
    }
})
</script>

<body>
  <div class="container">
    {#if success }
      <div class="user-info">
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Email:</strong> {email}</p>
      </div>

      <form method="post" action="?/updateEmail" on:submit={()=>{setTimeout(()=>invalidateAll(), 1000)}}>
          <label for="email">New Email:</label>
          <input class="email" type="text" id="email" name="email" bind:value={newEmail}>
          <button type="submit">Change Email</button>
       </form>      
    
      <form method="post" action="?/updatePassword" on:submit={invalidateAll}>
          <label for="password">New Password:</label>
          <input class="password" type="text" id="password" name="password" bind:value={newPassword}>
          <button type="submit">Change Password</button>
      </form>
      
    {:else}
        <div class="error-message">
            <p><strong>{pageError}</strong></p>
        </div>
    {/if}
  </div>
</body>
  
   <div class='email-popup'>
    {#if form && form.field === 'email'} 
  <Popup message={form.message} success={form.success}/>
  {/if}
   </div>

   <div class='password-popup'>
    {#if form && form.field === 'password'}
  <Popup message={form.message} success={form.success}/>
  {/if}
   </div>
  
<style>
/* General body styling */
body {
    font-family: Arial, sans-serif;
    margin:0;
    padding: 0;
    display: flex; /* Enable flexbox */
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    flex-direction: column;
    height: 100vh;
}

/* Main Container */
.container {
    max-width: 50wv;
    margin: 50px auto;
    padding: 30px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* User Information */
.user-info {
    margin-bottom: 50px;
}

.user-info p {
    margin-top: 5px;
    margin-bottom: 20px;
    font-size: 18px;
    color: #333;
}

.error-message p{
    margin:5px 0;
    font-size: 16px;
    color:#610707
}
/* Form Styling */
form {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    margin-top:30px;
    align-items: center;
}

form label {
    width: 120px;
    font-size: 16px;
    color: #333;
    font-weight: bold;
}

input[type="text"] {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    margin-right: 10px;
}

button {
    padding: 8px 16px;
    position: relative;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.email-popup {
    position: absolute;
    justify-content: center; /* Center horizontally */
    top: 44%;
}

.password-popup {
    position: absolute;
    justify-content: center; /* Center horizontally */
    top: 64.5%;
}

</style>