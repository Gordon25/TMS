<script lang='ts'>
  import Modal from "$lib/components/Modal.svelte";
  import AppForm from "../../lib/components/App/AppForm.svelte";
  import type { PageServerData } from "./$types";
  import Popup from "$lib/components/Popup.svelte"
  import currentApp from "$lib/stores/currentApp";
  import { goto } from "$app/navigation";
  import { couldStartTrivia } from "typescript";
  import { redirect } from "@sveltejs/kit";
  import { onMount } from "svelte";
  let showModal = false;
  let apps:App[];
  let groups:string[];
  let token:string;
  let isUserPL:boolean;
  export let data:PageServerData
  let createAppSuccessMsg:string|undefined;
  const closeModal = ()=> {
    (showModal = false)
  }
  const openModal = ()=> {
    (showModal = true)
  }
  const handleSuccess=(event)=>{
    createAppSuccessMsg = event.detail;
  }
  const viewAppDetails = (app_acronym:string)=>{
    localStorage.setItem('app', app_acronym); 
    // window.location.href='/app'
    goto('/app');
  }
  $:({apps, groups, token, isUserPL} = data);
  const timeout= 3000;
  $:{
    if (createAppSuccessMsg) {
      setTimeout(()=>{
        createAppSuccessMsg = undefined;
      }, timeout)
    }
  }
  
</script>
<body>
  {#if createAppSuccessMsg}
    <Popup message={createAppSuccessMsg} success={true}/>
  {/if}
  {#if showModal}
    <Modal {closeModal} bind:showModal>
      <AppForm isCreate={true} {token} on:close={closeModal} on:createSuccess={handleSuccess} 
      createGroups={groups} openGroups={groups} todoGroups={groups} doingGroups={groups} doneGroups={groups}/>
    </Modal>
  {/if}
  <table>
      <thead>
          <tr>
              <th>Acronym</th>
              <th>Rnumber</th>
              <th>Start</th>
              <th>End</th>
              <th>Task Create</th>
              <th>Task Open</th>
              <th>Task To Do</th>
              <th>Task Doing</th>
              <th>Task Done</th>
              <th>Description</th>
              <th>
              {#if isUserPL}
                <button on:click={openModal}>Create App</button>
              {/if}
              </th>
            </tr>
      </thead>
      
      <tbody>
        {#each apps as app}
          <tr>
              <td>{app.app_acronym}</td>
              <td>{app.app_rnumber}</td>
              <td>{app.app_startdate}</td>
              <td>{app.app_enddate}</td>
              <td>{app.app_permit_create}</td>
              <td>{app.app_permit_open}</td>
              <td>{app.app_permit_todolist}</td>
              <td>{app.app_permit_doing}</td>
              <td>{app.app_permit_done}</td>
              <td>{app.app_description}</td>
              <td><button on:click={()=>{viewAppDetails(app.app_acronym)}}>View App</button></td>
          </tr>
          {/each}
      </tbody>
  </table>

</body>

<style>
body{
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  margin-top: 30px;

  align-items: top;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: fixed; /* Ensures that columns maintain a fixed width */
}

th, td {
  padding: 10px;
  text-align: center;
  
}

td { 
    width: 200px; /* Set a fixed width or adjust as needed */
    overflow: hidden; /* Hide any content that overflows the container */
    white-space: nowrap; /* Prevent text from wrapping to the next line */
    text-overflow: ellipsis; /* Display an ellipsis (...) to indicate clipped text */
    padding: 5px; /* Optional: add padding for spacing */
}
th {
  font-weight: bold;
  background-color:transparent;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody {
  background-color: #f3f3f3;
}
tbody:hover {
  background-color: #f0f0f0;
}

tr {
  border: 1px solid black;
}

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
</style>
