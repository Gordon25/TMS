<script lang='ts'>
  import type {PageServerData, ActionData} from "./$types"
  export let data:PageServerData
  export let form:ActionData
  const PASSWORD_PLACEHOLDER = "********"

  import { goto, invalidateAll } from "$app/navigation";
  import { writable } from 'svelte/store';
  import type { Writable } from "svelte/store";
  import MultiSelect from 'svelte-multiselect';
  import { PUBLIC_BACKEND_HOSTNAME } from "$env/static/public";
  import axiosInstance from "$lib/axiosConfig";

  const {users, userError, groups, groupError} = data;

  interface User {
    username:string,
    password:string,
    email:string,
    groups:string[],
    isActive:boolean
  }
$:{console.log("NEW USER ", data)}
let tempUser:User = {
  username:'',
  password:'',
  email:'',
  groups:[],
  isActive:true
}
  
  // Functions to handle editing
  function startEditing(username:string, groups:string[] ) {
    tempUser.username = username;
    tempUser.groups = groups;
  }
  const token = data.token
  const updateUser  = async () => {
    const response = await axiosInstance
      .put(
        `/users/${tempUser.username}`,
        {
          email:tempUser.email,
          password:tempUser.password,
          groups:tempUser.groups,
          isActive:tempUser.isActive
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => res.data)
    console.log("UPDATE RESPONSE ", response)
    const {success, message} = response
    return response
  }
  

  const stopEditing = async () => {
    tempUser.username = '';
  }
  let newUserGroups:string[] = []

</script>

<form method="post" action="?/createGroup" on:submit={invalidateAll}>
  <label for="groupname">New Group:</label>
  <input type="text" id="groupname" name="groupname">
  <button type="submit">Create Group</button>
</form>

<div class="container">
{#if data.users && data.users.length > 0}
<form method="post" action="?/createUser" id="createUserForm" on:submit={invalidateAll}></form>
<!-- <form method="post" action="?/updateUser" id="updateUserForm" on:submit={invalidateAll}></form> -->
<table class="user-table">
  <thead>
      <tr>
          <th>Username:</th>
          <th>Password:</th>
          <th>Email:</th>
          <th>Groups:</th>
          <th>isActive:</th>
          <th>Create/Edit</th>
      </tr>
  </thead>
  <tbody>
    
    <tr>
       
      <td>
        <input form="createUserForm" type="text" id="username" name="new-username" />
      </td>
      <td><input form="createUserForm" type="text" id="password" name="new-password" /></td>
      <td><input form="createUserForm" type="text" id="email" name="new-email" /></td>
      <td>
        {#if data.groups && data.groups.length > 0}   
            <MultiSelect bind:selected={newUserGroups} placeholder='Select Groups' options={groups}/>
          {/if}
        
      </td>
      <td>
      <input form="createUserForm" type="checkbox" id="isActive" name="new-isActive"/>
      </td>
      <td>
        <input form="createUserForm" type='submit' on:click={()=> console.log("Submitted")}/>
      </td>
    
    </tr>
      <!-- Loop through the users array using {#each} to generate table rows -->
      {#each users as user (user.id)}
          <tr>
            {#if tempUser.username != user.username}
              <td>{user.username}</td>
              <td>{PASSWORD_PLACEHOLDER}</td>
              <td>{user.email}</td>
              <td>
                <select>
                {#each user.groups as group}
                <option>
                  {group}
                </option>
                {/each}
              </select>
            </td>
              <td>
              <input 
                type="checkbox" 
                bind:checked={user.isActive} 
                disabled
              />
            </td>
            <td>
              <button class="edit-btn" on:click={()=>{startEditing(user.username, user.groups)}}>Edit</button>
            </td>
          {:else}
          <td>
            {user.username}
            <input form="updateUserForm" type="hidden" name="username"/>
          </td>
          <td><input form="updateUserForm" type="text" name='password' bind:value={tempUser.password}/></td>
          <td><input form="updateUserForm" type="text" name='email' bind:value={tempUser.email}/></td>
          <td>
            <MultiSelect bind:selected={tempUser.groups} options={groups} placeholder="Select Groups"/>
        </td>
          <td>
          <input 
            form="updateUserForm"
            type="checkbox" 
            name="isActive"
            bind:checked={tempUser.isActive} 
          on:change={val=>!val} 
          />
        </td>
        <td>
          <button class="edit-btn" on:click={()=>{ stopEditing()}}>Cancel</button>
          <input form="updateUserForm" type="submit" class="edit-btn" on:click={()=>{
            stopEditing()
            updateUser()
            invalidateAll()}}/>
        </td>
          {/if}
        
        </tr>
      {/each}
  
</table>

{/if}
</div>

<style>
/* Container */
.container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background-color: #ffffff; /* White background for content */
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    max-height: 1000px; /* Set the height of the scrollable area */
    overflow-y: auto;  /* Enable vertical scrolling */
}
 /* Table Styles */
.user-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    
}
.user-table th,
.user-table td {
    padding: 12px;
    border: 1px solid #ddd; /* Light gray border */
    text-align: left;
    
}

/* Header Styles */
.user-table th {
    background-color: #2b74e2; /* Green background for header */
    color: white; /* White text */
}

/* Row Hover Effect */
.user-table tr:hover {
    background-color: #f1f1f1; /* Light gray background on hover */
}

/* Input Fields */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="select"] {
    width: 100%; /* Full width */
    padding: 10px; /* Padding inside input */
    margin: 5px 0; /* Margin above and below input */
    border: 1px solid #ccc; /* Light border */
    border-radius: 4px; /* Rounded corners */
    font-size: 14px; /* Font size */
}

/* Button Styles */
button {
    padding: 10px 15px; /* Padding around button text */
    background-color: #007BFF; /* Blue background */
    color: white; /* White text */
    border: none; /* Remove border */
    border-radius: 4px; /* Rounded corners */
    cursor: pointer; /* Pointer cursor on hover */
    font-size: 14px; /* Font size */
    transition: background-color 0.3s ease; /* Smooth transition */
}

button:hover {
    background-color: #0056b3; /* Darker blue on hover */
}


/* Responsive Design */

@media (max-width: 768px) {
    .user-table th,
    .user-table td {
        display: block; /* Make cells block for mobile view */
        width: 100%; /* Full width */
    }

    /* Input fields and buttons should be responsive */
    input[type="text"],
    input[type="email"],
    input[type="password"],
    button {
        width: calc(100% - 20px); /* Full width minus padding */
    }
}

 /* Basic styles */
 .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    padding: 12px 16px;
    z-index: 1;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }


</style>