<script lang="ts">
import Select from "svelte-select";
import { createEventDispatcher } from "svelte";
import axiosInstance from "$lib/axiosConfig";
import { invalidateAll } from "$app/navigation";
import Popup from "$lib/components/Popup.svelte";
  export let isCreate:boolean;
  export let createGroups: string[]=[];
  export let openGroups: string[]=[];
  export let todoGroups: string[]=[];
  export let doingGroups: string[]=[];
  export let doneGroups: string[]=[];
  export let token:string='';
  export let appAcronym:string='';
  export let startDate:string='';
  export let endDate:string='';
  export let description:string='';
  export let createGroup: string='';
  export let openGroup: string='';
  export let todoGroup: string='';
  export let doingGroup: string='';
  export let doneGroup: string='';
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
        <div class='input-label'>
        <label for="app-acronym">App Acronym:</label>
        </div>
      {#if isCreate}
        <input type="text" id="app-acronym" name="app-acronym" bind:value={appAcronym}/>  
      {:else}
        <div class='input-value'>
        <p>{appAcronym}</p>
        </div>
      {/if}
      </div>
      {#if appResult && appResult.field ==='app acronym'}
      <Popup message={appResult.message} success={appResult.success}/>
      {/if}
      <div class="input-group">
        <div class='input-label'>
        <label for="start-date">Start Date:</label>
        </div>
        <input type="date" id="start-date" name="start-date" bind:value={startDate} disabled={!isCreate}/>
      </div>
      {#if appResult && appResult.field ==='start date'}
      <Popup message={appResult.message} success={appResult.success}/>
      {/if}
      <div class="input-group">
        <div class='input-label'>
        <label for="end-date">End Date:</label>
        </div>
        <input type="date" id="end-date" name="end-date" bind:value={endDate} disabled={!isCreate}/>
      </div>
      {#if appResult && appResult.field ==='end date'}
      <Popup message={appResult.message} success={appResult.success}/>
      {/if}
      <div class="task-permissions">
        <p><strong>Task Permissions</strong></p>
      </div>
        <div class="input-group">
          <div class='input-label'>
          <label for="create">Create:</label>
          </div>
          {#if isCreate}
          <div class='dropdown-select'>
            <Select items={createGroups} bind:justValue={createGroup} disabled={!isCreate} value={createGroup} />
          </div>
          {:else}
          <div class="input-value">
            <p>{createGroup}</p>
          </div>
          {/if}
        </div>
      {#if appResult && appResult.field ==='create'}
      <Popup message={appResult.message} success={appResult.success}/>
      {/if}
        <div class="input-group">
          <div class='input-label'>
          <label for="open">Open:</label>
          </div> 
          {#if isCreate}
          <div class="dropdown-select">
          <Select items={openGroups} bind:justValue={openGroup}/>
          </div>
          {:else}
          <div class="input-value">
            <p>{openGroup}</p>
          </div>
          {/if}
        </div>
        {#if appResult && appResult.field ==='open'}
        <Popup message={appResult.message} success={appResult.success}/>
        {/if}
        <div class="input-group">
          <div class='input-label'>
          <label for="todo">ToDo:</label>
          </div> 
          {#if isCreate}
          <div class="dropdown-select">
          <Select items={todoGroups} bind:justValue={todoGroup}/>
          </div>
          {:else}
          <div class="input-value">
            <p>{todoGroup}</p>
          </div>
          {/if}
        </div>
        {#if appResult && appResult.field ==='todo'}
        <Popup message={appResult.message} success={appResult.success}/>
        {/if}
        <div class="input-group">
          <div class='input-label'> 
            <label for="doing">Doing:</label>
          </div>
          {#if isCreate}
          <div class="dropdown-select">
          <Select items={doingGroups} bind:justValue={doingGroup}/>
          </div>
          {:else}
          <div class="input-value">
            <p>{doingGroup}</p>
          </div>
          {/if}
        </div>
        {#if appResult && appResult.field ==='doing'}
        <Popup message={appResult.message} success={appResult.success}/>
        {/if}
        <div class="input-group">
          <div class='input-label'>
          <label for="done">Done:</label>
          </div>
          {#if isCreate}
          <div class="dropdown-select">
          <Select items={doneGroups} bind:justValue={doneGroup}/>
          </div>
          {:else}
          <div class="input-value">
            <p>{doneGroup}</p>
          </div>
          {/if}
        </div>
        {#if appResult && appResult.field ==='done'}
        <Popup message={appResult.message} success={appResult.success}/>
        {/if}
      
    </div>
    <div class="form-right">
      <div class="input-text">
        <div class="input-label">
          <label for="description">Description:</label>
        </div>
        
        <textarea id="description" bind:value={description} maxlength="255" disabled={!isCreate}></textarea>
      </div>
      
      <div class="form-actions">
        {#if isCreate}
        <button type="submit" class="btn save-btn" on:click|preventDefault={createApp}>Save Changes</button>
        <button class="btn cancel-btn" on:click|preventDefault={closeModal}>Cancel</button>
        {/if}
      </div>
      
    </div>
  </form>
  </div>  


<style>
  .form-container {
    width: 95%;
    height: 90%;
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
  input[type='date'] {
    width: 70%;
  }

  .dropdown-select {
    width: 75%;
  }
  textarea {
    height: 80%;
    width: 100%;
    font-size: 18px;
    resize: none;
  }

  .form-actions {
    grid-column: span 2;
    display: flex;
    justify-content: space-between;
    min-height: 6%;
    width: 97%;
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
