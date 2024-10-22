<script lang="ts">
import { onMount } from "svelte";
import axiosInstance from "$lib/axiosConfig";
  export let token:string='';
  export let appAcronym:string='';
  let app:App = {
  app_acronym:'',
  app_rnumber:0,
  app_description:"",
  app_startdate:"",
  app_enddate:'',
  app_permit_create:"",
  app_permit_open:'',
  app_permit_todolist:'',
  app_permit_doing:"",
  app_permit_done:'',
};

onMount(async()=>{
  app = await axiosInstance.post('/app',
  {
    appAcronym
  },
  {
   headers:{
    Authorization:`Bearer ${token}`
   },
   withCredentials:true 
  }).then(res=>res.data.data[0])
})
</script>

  <div class="form-container">
  <form method="post" on:submit|preventDefault>
    <div class="form-left">
      <div class="input-group">
        <div class='input-label'>
        <label for="app-acronym">App Acronym:</label>
        </div>
        <div class='input-value'>
        <p>{app.app_acronym}</p>
        </div>
      </div>
      <div class="input-group">
        <div class='input-label'>
        <label for="start-date">Start Date:</label>
        </div>
        <input type="date" id="start-date" name="start-date" bind:value={app.app_startdate} disabled/>
      </div>
      <div class="input-group">
        <div class='input-label'>
        <label for="end-date">End Date:</label>
        </div>
        <input type="date" id="start-date" name="start-date" bind:value={app.app_enddate} disabled/>
      </div>
      <div class="task-permissions">
        <p><strong>Task Permissions</strong></p>
      </div>
        <div class="input-group">
          <div class='input-label'>
          <label for="create">Create:</label>
        </div>
          <div class="input-value">
            <p>{app.app_permit_create}</p>
          </div>
        </div>
        <div class="input-group">
          <div class='input-label'>
          <label for="open">Open:</label>
          </div>
          <div class="input-value">
            <p>{app.app_permit_open}</p>
          </div>
        </div>
        <div class="input-group">
          <div class='input-label'>
          <label for="todo">ToDo:</label>
          </div>
          <div class="input-value">
            <p>{app.app_permit_todolist}</p>
          </div>
        </div>
        <div class="input-group">
          <div class='input-label'> 
            <label for="doing">Doing:</label>
          </div>
          <div class="input-value">
            <p>{app.app_permit_doing}</p>
          </div>
        </div>
        <div class="input-group">
          <div class='input-label'>
          <label for="done">Done:</label>
          </div>
          <div class="input-value">
            <p>{app.app_permit_done}</p>
          </div>
        </div>
      
    </div>
    <div class="form-right">
      <div class="input-text">
        <div class="input-label">
          <label for="description">Description:</label>
        </div>
        <textarea id="description" bind:value={app.app_description} disabled></textarea>
      </div>
      
    </div>
  </form>
  </div>  


<style>
  .form-container {
    width: 95%;
    height: 100%;
    margin: 0 auto;
    padding: 20px;
    background-color: #f4f4f4;
    /* border: 1px solid #ddd; */
    border-radius: 10px;
  }

  form {
    display: grid;
    grid-template-columns: 0.5fr 0.75fr;
    gap: 0;
    font-size: 18px;
  }

  .form-left {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  label {
    margin-bottom: 5px;
    font-weight: bold;
  }

  .input-group {
    margin-bottom: 20px;
    display: grid;
    align-items: center;
    flex-direction: row;
    gap: 10px;
    width: 100%;
    justify-content: flex-end;
    grid-template-columns: 0.30fr 0.80fr;
  }

  .input-label {
    align-content: right;
    white-space: nowrap;
  }

  .input-text {
    height: 95%;
    display: flex;
    flex-direction: column;
    width: 95%;
    align-items: baseline;
    margin-left: 0;
    margin-bottom: 0;
  }

  .input-text .input-label{
    margin-top: 0;
    margin-bottom: 40px;
  }

input[type="date"],
textarea {
    /* Make the select as wide as the input fields */
    padding: 10px;
    border-radius: 5px;
    background-color: white;
    font-size: 16px;
  }
  
  input[type='date'] {
    width: 70%;
  }

  textarea {
    height: 100%;
    width: 100%;
    font-size: 18px;
    resize: none;
    background-color: white;
  }

</style>
