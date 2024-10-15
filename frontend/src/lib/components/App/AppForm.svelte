<script lang="ts">
import Select from "svelte-select";
import { createEventDispatcher } from "svelte";
import axiosInstance from "$lib/axiosConfig";
import { invalidateAll } from "$app/navigation";
import Popup from "$lib/components/Popup.svelte";
  export let createGroups: string[];
  export let openGroups: string[];
  export let todoGroups: string[];
  export let doingGroups: string[];
  export let doneGroups: string[];
  export let token:string;
  let appAcronym:string='';
  let startDate:string='';
  let endDate:string='';
  let description:string='';
  let createGroup: string='';
  let openGroup: string='';
  let todoGroup: string='';
  let doingGroup: string='';
  let doneGroup: string='';
  let appResult:{success:boolean, field:string,message:string}|undefined;
  const dispatch = createEventDispatcher();
  function closeModal() {
    dispatch('close');
  }
  const createApp = async ()=> {
    const createAppResult = await axiosInstance
      .post(
        `/apps`,
        {
          appAcronym,
          startDate,
          endDate,
          description,
          create:createGroup,
          open:openGroup,
          todo:todoGroup,
          doing:doingGroup,
          done:doneGroup,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        let data = res.data;
        const { success, field, message } = data;
        return { success, field, message };
      });
    const {success} = createAppResult;
    if (success) {
      dispatch('createSuccess', createAppResult.message)
      invalidateAll();
      closeModal();
    }
    appResult = createAppResult;
  }

  const timeout = 3000
  $:{
    if (appResult) {
      setTimeout(()=>{
        appResult = undefined;
      }, timeout)
    }
  }

</script>

{#if appResult && appResult.field ==='app'}
<Popup message={appResult.message} success={appResult.success}/>
{/if}
  <div class="form-container">
  <form method="post" on:submit|preventDefault>
    <div class="form-left">
      <div class="input-group">
        <label for="app-acronym">App Acronym:</label>
        <input type="text" id="app-acronym" name="app-acronym" bind:value={appAcronym}/>
      </div>
      {#if appResult && appResult.field ==='app acronym'}
      <Popup message={appResult.message} success={appResult.success}/>
      {/if}
      <div class="input-group">
        <label for="start-date">Start Date:</label>
        <input type="date" id="start-date" name="start-date" bind:value={startDate}/>
      </div>
      {#if appResult && appResult.field ==='start date'}
      <Popup message={appResult.message} success={appResult.success}/>
      {/if}
      <div class="input-group">
        <label for="end-date">End Date:</label>
        <input type="date" id="end-date" name="end-date" bind:value={endDate}/>
      </div>
      {#if appResult && appResult.field ==='end date'}
      <Popup message={appResult.message} success={appResult.success}/>
      {/if}
      <div class="task-permissions">
        <p><strong>Task Permissions</strong></p>
      </div>
        <div class="input-group">
          <label for="create">Create:</label>
          <div class='dropdown-select'>
            <Select items={createGroups} bind:justValue={createGroup}/>
            <!-- <input type="hidden" id="create" name="create" value="{createGroup}" /> -->
          </div>
        </div>
        {#if appResult && appResult.field ==='create'}
      <Popup message={appResult.message} success={appResult.success}/>
      {/if}
        <div class="input-group">
          <label for="open">Open:</label>
          <div class="dropdown-select">
          <Select items={openGroups} bind:justValue={openGroup}/>
          <!-- <input type="hidden" id="open" name="open" value="{openGroup}" /> -->
          </div>
        </div>
        {#if appResult && appResult.field ==='open'}
        <Popup message={appResult.message} success={appResult.success}/>
        {/if}
        <div class="input-group">
          <label for="todo">ToDo:</label>
          <div class="dropdown-select">
          <Select items={todoGroups} bind:justValue={todoGroup}/>
          <!-- <input type="hidden" id="todo" name="todo" value="{todoGroup}" /> -->
          </div>
        </div>
        {#if appResult && appResult.field ==='todo'}
        <Popup message={appResult.message} success={appResult.success}/>
        {/if}
        <div class="input-group">
          <label for="doing">Doing:</label>
          <div class="dropdown-select">
          <Select items={doingGroups} bind:justValue={doingGroup}/>
          <!-- <input type="hidden" id="doing" name="doing" value="{doingGroup}" /> -->
          </div>
        </div>
        {#if appResult && appResult.field ==='doing'}
        <Popup message={appResult.message} success={appResult.success}/>
        {/if}
        <div class="input-group">
          <label for="done">Done:</label>
          <div class="dropdown-select">
          <Select items={doneGroups} bind:justValue={doneGroup}/>
          <!-- <input type="hidden" id="done" name="done" value="{doneGroup}" /> -->
          </div>
        </div>
        {#if appResult && appResult.field ==='done'}
        <Popup message={appResult.message} success={appResult.success}/>
        {/if}
      
    </div>
    <div class="form-right">
      <div class="input-text">
        <label for="description">Description:</label>
        <textarea id="description" bind:value={description}></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn save-btn" on:click|preventDefault={createApp}>Save Changes</button>
        <button class="btn cancel-btn" on:click|preventDefault={closeModal}>Cancel</button>
      </div>
    </div>
  </form>
  </div>  


<style>
  .form-container {
    width: 90%;
    height: 60%;
    margin: 20px auto;
    padding: 20px;
    background-color: #f4f4f4;
    border: 1px solid #ddd;
    border-radius: 10px;
  }

  form {
    display: grid;
    grid-template-columns: 0.5fr 0.75fr;
    gap: 20px;
  }

  .form-left {
    display: flex;
    flex-direction: column;
    
   
  }
  label {
    margin-bottom: 5px;
    font-weight: bold;
  }

  .input-group {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 20px;
    width: 100%;
    justify-content: flex-end;
    margin-left: 0;
  }
  .input-text {
    height: 80%;
    margin-bottom: 10px;
    display: flex;

    flex-direction: column;
    gap: 20px;
    width: 100%;
    justify-content: flex-end;
    margin-left: 0;
  }
input[type="text"],
input[type="date"],
textarea,
/* Target the dropdown select container */
.dropdown-select {
    /* Make the select as wide as the input fields */
    padding: 10px;
    border-radius: 5px;
  }
  
  input[type='text'],
  input[type='date'],
  .dropdown-select {
    width: 70%;
    
  }
  textarea {
    height: 80%;
    width: 90%;
    font-size: 18px;
  }

  .form-actions {
    grid-column: span 2;
    display: flex;
    justify-content: space-between;
  }

  button {
    padding: 10px 20px;
    background-color: #4a4a4a;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #333;
  }

  button[type="button"] {
    background-color: #bbb;
  }

  button[type="button"]:hover {
    background-color: #999;
  }
</style>
