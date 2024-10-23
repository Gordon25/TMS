<script lang='ts'>
  import type {PageServerData, ActionData} from "./$types"
  export let data:PageServerData
  export let form:ActionData
  const PASSWORD_PLACEHOLDER = "********"
  import { goto, invalidateAll } from "$app/navigation";
  import MultiSelect from 'svelte-multiselect';
  import axiosInstance from "$lib/axiosConfig.ts";
  import Popup from "$lib/components/Popup.svelte"
  import { onMount } from "svelte";
  import loginStatus from "$lib/stores/loginStatus";
  import { redirect } from "@sveltejs/kit";
  let newUserGroups:string[] = form&&form.groups? form.groups:[]
  let isActive=(form&&form.isActive)? form.isActive:true;
let tempUser:User = {
  username:'',
  password:'',
  email:'',
  groups:[],
  isActive:true
}
let selectedUser:User = {...tempUser};

  function startEditing(user:User ) {
    selectedUser = {...tempUser, username:user.username, groups:user.groups}
  }

  function stopEditing() {
    selectedUser = {...tempUser}
  }

  const updateUser  = async (user:User) => {
    const responseData = await axiosInstance
      .put(
        `/users/${user.username}`,
        {
          email:user.email,
          password:user.password,
          groups:user.groups,
          isActive:user.isActive
        },
        {
          withCredentials: true,
        }
      )
      .then(res=>res.data)
      .catch((error) => {
      if (error.status === 401) {
        throw redirect(303, "/login");
      } else {
        console.log(error.status);
      }
    });
     
 
    const {success, field, message} = responseData
    if (success === true) {
      invalidateAll();
      stopEditing();
    } 
    return {success, field, message};
  }

  let updateResult:{success:boolean, field:String,message:String}|undefined; 
  const submitFunc = async()=> {
    updateResult = await updateUser(selectedUser);
  }

  let users:User[]=[], userError:string, groups:string[]=[], groupError:string, token:string|undefined;
  $:({users, userError, groups, groupError, token} = data);
  
  const timeout = 3000
  $:{
    if (updateResult) {
      setTimeout(()=>{
        updateResult = undefined;
      }, timeout)
    }
  }
  onMount(()=>{
    if (!$loginStatus.isAdmin) {
      goto('/tms')
    }
  })
</script>
<body>
<form class="create-group-form" method="post" action="?/createGroup" on:submit={invalidateAll}>
  <label for="groupname">New Group:</label>
  <input type="text" id="groupname" name="groupname" value={form&&form.groupname?form.groupname:''}>
  <button type="submit">Create Group</button>
</form>

{#if data.users && data.users.length > 0}
<form class='create-user-form' method="post" action="?/createUser" id="createUserForm" on:submit={invalidateAll}></form>
<div class="table-container">
  <table class="thead-container">
  <thead>
      <tr>
          <th >Username:</th>
          <th >Password:</th>
          <th >Email:</th>
          <th >Groups:</th>
          <th >Active:</th>
          <th >Create/Edit</th>
      </tr>
  </thead>
</table>
<div class="scrollable-body">
  <table class="tbody-container">
  <tbody>
    <tr>
      <td>
        <input form="createUserForm" type="text" id="username" name="new-username" value={form&&form.username? form.username:''} />
        {#if form && form.field ==='username'}
        <Popup message={form.message} success={form.success}/>
        {/if}
      </td>
      <td><input form="createUserForm" type="password" id="password" name="new-password" value={form&&form.password? form.password:''}/>
      {#if form && form.field ==='password'}
      <Popup message={form.message} success={form.success}/>
      {/if}
      </td>
      <td><input form="createUserForm" type="text" id="email" name="new-email" value={form&&form.email? form.email:''}/>
        {#if form && form.field ==='email'}
        <Popup message={form.message} success={form.success}/>
        {/if}
      </td>
      <td>
        {#if data.groups && data.groups.length > 0}   
            <MultiSelect bind:selected={newUserGroups} placeholder='Select Groups' options={groups} />
            <input form="createUserForm" type="hidden" name="new-groups" value={newUserGroups}>
          {/if}
        
      </td>
      <td>
      <input form="createUserForm" type="checkbox" id="isActive" name="new-isActive" bind:checked={isActive}/>
      </td>
      <td>
        <button form="createUserForm" type='submit'>Add</button>  
      </td>
    
    </tr>
      <!-- Loop through the users array using {#each} to generate table rows -->
      {#each users as user}
          <tr>
            {#if selectedUser.username != user.username}
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
              <input type="checkbox" bind:checked={user.isActive} disabled />
            </td>
            <td>
              <button class="edit-btn" on:click={()=>{startEditing(user)}}>Edit</button>
            </td>
          {:else}
          <td>
            {user.username}
            <input type="hidden" name="username"/>
          </td>
          <td>
            <input type="password" name='password' bind:value={selectedUser.password}/>
            {#if updateResult && updateResult.field ==="password"}
            <Popup message={updateResult.message} success={updateResult.success}/>
            {/if}
          </td>
          <td>
            <input type="text" name='email' bind:value={selectedUser.email}/>
            {#if updateResult && updateResult.field ==='email'}
            <Popup message={updateResult.message} success={updateResult.success}/>
            {/if}
          </td>
          <td>
            <MultiSelect bind:selected={selectedUser.groups} options={groups} closeDropdownOnSelect={true} placeholder="Select Groups"/>
        </td>
          <td>
          <input 
            type="checkbox" 
            bind:checked={selectedUser.isActive} 
          />
        </td>
        <td>
          <button form="updateUserForm" type="submit" class="edit-btn" on:click={submitFunc}>Save</button>
          <button class="edit-btn" on:click={stopEditing}>Cancel</button>
        </td>
        {/if}      
        </tr>
      {/each}
  </tbody>
</table>
</div>
</div>
{/if}
</body>
{#if form && form.field==='group'}
<div class='group-msg'>
  <Popup message={form.message} success={form.success}/></div>
{/if}

{#if form && form.field==='user'}
<div class='user-msg'>
  <Popup message={form.message} success={form.success}/>
</div>
{/if}

{#if updateResult && updateResult.field==='user'}
<div class='group-msg'>
  <Popup message={updateResult.message} success={updateResult.success}/>
</div>
{/if}
<style>
.group-msg {
  position:absolute;
  top:5vh;
  right:700px;
}
.user-msg {
  position:absolute;
  top:5vh;
  right:300px;
}
body {
    display: flex;
    flex-direction: column;
    width: 100vw;
    position:fixed;
    top:2.5vh;
    background-color: #f5f5f5;
    font-family: Arial, sans-serif;
    margin-top:60px;
    padding: 0;
    
}

/* Containers */
.table-container {
  width: 90%;
  background-color: #f0f0f0;
  justify-content: center;
  margin: 0 auto; /* Center the table */
}

.thead-container, .tbody-container {
  width: 100%;
  overflow-x: hidden;
  table-layout: fixed;
  border-collapse: collapse;
}

.scrollable-body {
  max-height: 500px; /* Set your height */
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scroll if not needed */
}

.create-group-form {
  margin:30px 40px;
  margin-right: 10px;
  width: 50vw;
}

.create-group-form input {
  width: 10px;
  max-width: 250px; /* Restrict the maximum width */
}


.thead-container th, .tbody-container td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ccc;
  vertical-align: middle; /* Aligns content vertically */
  box-sizing: border-box;
  word-wrap: break-word; /* Allow long words to break */
    overflow-wrap: break-word; /* This is the newer property */
    white-space: normal; /* Allow wrapping */
    max-width: 200px; /* Optional: Set a max width for the cell */
}
.tbody-container td {
    border: 1px solid #ddd; /*Light gray border*/
}

.thead-container th {
  position: sticky;  /* Fixes the header at the top */
  border: 1px solid #ddd; /* Light gray border */
  top:0;
  z-index: 2;
}
input[type="text"], input[type="password"], select {
    width: 90%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px; /* Font size */
}

/* Row Hover Effect */
.thead-container tr:hover, .tbody-container tr:hover{
    background-color: #f1f1f1; /* Light gray background on hover */
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
    .thead-container th,
    .tbody-container td {
        display: block; /* Make cells block for mobile view */
        width: 100%; /* Full width */
    }
}


.thead-container th:nth-child(1), .tbody-container td:nth-child(1) {
    width: 10%;
  }

  th:nth-child(2), td:nth-child(2) {
    width: 10%;
  }
  th:nth-child(3), td:nth-child(3) {
    width: 15%;
  }

  th:nth-child(4), td:nth-child(4) {
    width: 20%;
  }

  th:nth-child(5), td:nth-child(5) {
    width: 5%;
  }

  th:nth-child(6), td:nth-child(6) {
    width: 10%;
  }


  .scrollable-body::-webkit-scrollbar {
    display: none; /* For Chrome, Safari, and Edge */
}
</style>