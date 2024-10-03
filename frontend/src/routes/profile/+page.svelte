<script lang='ts'>
  import { invalidateAll } from "$app/navigation";
  import type { PageServerData, ActionData } from "./$types";
  export let data:PageServerData;
  export let form:ActionData
  let username ="";
  let email="";
  $:{
    console.log("FORM    ", form)
    username = data.username;
    email = data.email;
  }
  let newEmail = "";
  let newPassword = "";
  

</script>

<body>

  <div class="container">
      <div class="user-info">
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Email:</strong> {email}</p>
      </div>

      <form method="post" action="?/updateUser" on:submit={()=>invalidateAll()}>
          <label for="email">New Email:</label>
          <input type="text" id="email" name="email" bind:value={newEmail}>
          <button type="submit" disabled={newEmail.trim() === ''}>Change Email</button>
      </form>
      
      <form method="post" action="?/updateUser" on:submit={()=>invalidateAll()}>
          <label for="password">New Password:</label>
          <input type="password" id="password" name="password" bind:value={newPassword}>
          <button type="submit" disabled={newPassword.trim() === ''}>Change Password</button>
      </form>

      
  </div>
</body>

<style>
/* General body styling */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f9f9f9;
}

/* Main Container */
.container {
    max-width: 600px;
    margin: 50px auto;
    padding: 30px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* User Information */
.user-info {
    margin-bottom: 30px;
}

.user-info p {
    margin: 5px 0;
    font-size: 16px;
    color: #333;
}

/* Form Styling */
form {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

form label {
    width: 120px;
    font-size: 14px;
    color: #333;
    font-weight: bold;
}

input[type="text"], input[type="password"] {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    margin-right: 10px;
}

button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}
button:disabled {
            background-color: grey; /* Change button appearance when disabled */
            cursor: not-allowed; /* Change cursor when hovering over disabled button */
        }
</style>