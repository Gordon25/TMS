<script lang='ts'>
  import type { PageServerData } from "./$types";
  import Popup from "$lib/components/Popup.svelte"
  import Select from "svelte-select";
  import { goto, invalidateAll } from "$app/navigation";
  import { PUBLIC_APP_INIT_RNUMBER } from "$env/static/public";
  import axiosInstance from "$lib/axiosConfig.ts";
  let apps:App[];
  let groups:string[];
  let isUserPL:boolean;
  let appAcronym:string='';
  let appInitRNumber = PUBLIC_APP_INIT_RNUMBER;
  let startDate:string='';
  let endDate:string='';
  let description:string='';
  let createGroup: string='';
  let openGroup: string='';
  let todoGroup: string='';
  let doingGroup: string='';
  let doneGroup: string='';
  let selectedCreate='';
  let selectedOpen='';
  let selectedTodo='';
  let selectedDoing='';
  let selectedDone='';
  export let data:PageServerData
  let createAppSuccessResult:{success:boolean, field:string, message:string}|undefined;

  const viewAppDetails = (app_acronym:string)=>{
    localStorage.setItem('app', app_acronym); 
    goto('/app');
  }
  const autoExpandTextArea = (event:Event)=>{
    const element = event.target as HTMLTextAreaElement;
    element.style.height = '140px';
    element.style.height = `${element.scrollHeight}px`;
  }
  const autoExpandInput = (event:Event)=>{
    const element = event.target as HTMLTextAreaElement;
    element.style.height = '40px';
    element.style.height = `${element.scrollHeight}px`;
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
          withCredentials: true,
        }
      )
      .then((res) => {
        let data = res.data;
        const { success, field, message } = data;
        return { success, field, message };
      }).catch((error) => {
      if (error.status === 401) {
        goto("/login");
      } else {
        console.log(error.status);
      }
    });
    const {success} = createAppResult;
    if (success) {
      invalidateAll();
      appAcronym=''
      startDate=''
      endDate=''
      description=''
      selectedCreate=''
      selectedOpen=''
      selectedTodo=''
      selectedDoing=''
      selectedDone=''
    }
    createAppSuccessResult = createAppResult;
  }
  $:({apps, groups, token, isUserPL} = data);
  const timeout= 3000;
  $:{
    if (createAppSuccessResult) {
      setTimeout(()=>{
        createAppSuccessResult = undefined;
      }, timeout)
    }
  }
  $:console.log(appAcronym, startDate, endDate, createGroup, todoGroup, openGroup, doingGroup, doneGroup, description)
</script>
<body>
  {#if createAppSuccessResult && createAppSuccessResult.field==='app'}
    <Popup message={createAppSuccessResult.message} success={createAppSuccessResult.success}/>
  {/if}
  <!-- {#if showAppModal}
  <Modal closeModal={()=>{showAppModal=false}} bind:showModal={showAppModal} on:closeModal={invalidateAll}>
    <AppDetailsForm on:close={()=>{showAppModal=false}} {token} appAcronym={displayedAppAcronym}/>
  </Modal>
  {/if} -->
  <table class="thead-container">
      <thead>
          <tr>
              <th class='acronym'>Acronym</th>
              <th class='rnumber'>Running number</th>
              <th class='date'>Start</th>
              <th class='date'>End</th>
              <th class='create'>Task Create</th>
              <th class='open'>Task Open</th>
              <th class='todo'>Task To Do</th>
              <th class='doing'>Task Doing</th>
              <th class='done'>Task Done</th>
              <th class='description'>Description</th>
              <th class='action'></th>
            </tr>
      </thead>
      </table>
      <div class='scrollable-body'>
      <table class="tbody-container">
      <tbody>
        {#if isUserPL}
        <td class='acronym'>
          <input type="text" id="app-acronym" name="app-acronym" bind:value={appAcronym} on:input={autoExpandInput}/>
          {#if createAppSuccessResult && createAppSuccessResult.field==='app acronym'}
          <Popup message={createAppSuccessResult.message} success={createAppSuccessResult.success}/>
          {/if}
        </td>
        <td class='rnumber'>{appInitRNumber}</td>
        <td class='date'>
          <input type="date" id="start-date" name="start-date" bind:value={startDate}/>
          {#if createAppSuccessResult && createAppSuccessResult.field==='start date'}
          <Popup message={createAppSuccessResult.message} success={createAppSuccessResult.success}/>
          {/if}
        </td>
        <td class='date'>
          <input type="date" id="end-date" name="end-date" bind:value={endDate}/>
          {#if createAppSuccessResult && createAppSuccessResult.field==='end date'}
          <Popup message={createAppSuccessResult.message} success={createAppSuccessResult.success}/>
          {/if}
        </td>
        <td class='create'>
          <div class='dropdown-select'>
            <Select items={groups} bind:justValue={createGroup} bind:value={selectedCreate}/>
          </div>
          {#if createAppSuccessResult && createAppSuccessResult.field==='create'}
          <Popup message={createAppSuccessResult.message} success={createAppSuccessResult.success}/>
          {/if}
        </td>
        <td class='open'>
          <div class='dropdown-select' style='--width=10%'>
            <Select items={groups} bind:justValue={openGroup} bind:value={selectedOpen}/>
          </div>
          {#if createAppSuccessResult && createAppSuccessResult.field==='open'}
          <Popup message={createAppSuccessResult.message} success={createAppSuccessResult.success}/>
          {/if}
        </td>
        <td class='todo'>
          <div class='dropdown-select'>
            <Select items={groups} bind:justValue={todoGroup} bind:value={selectedTodo}/>
          </div>
          {#if createAppSuccessResult && createAppSuccessResult.field==='todo'}
          <Popup message={createAppSuccessResult.message} success={createAppSuccessResult.success}/>
          {/if}
        </td>
        <td class='doing'>
          <div class='dropdown-select'>
            <Select items={groups} bind:justValue={doingGroup} bind:value={selectedDoing}/>
          </div>
          {#if createAppSuccessResult && createAppSuccessResult.field==='doing'}
          <Popup message={createAppSuccessResult.message} success={createAppSuccessResult.success}/>
          {/if}
        </td>
        <td class='done'>
          <div class='dropdown-select'>
            <Select items={groups} bind:justValue={doneGroup} bind:value={selectedDone}/>
          </div>
          {#if createAppSuccessResult && createAppSuccessResult.field==='done'}
          <Popup message={createAppSuccessResult.message} success={createAppSuccessResult.success}/>
          {/if}
        </td>
        <td class='description'><textarea id="description" bind:value={description} maxlength="255" on:input={autoExpandTextArea}></textarea></td>
        <td class='action'><button on:click|preventDefault={createApp}>Create App</button></td>
        {/if}
        {#each apps as app}
          <tr>
              <td class='acronym'>{app.app_acronym}</td>
              <td class='rnumber'>{app.app_rnumber}</td>
              <td class='date'>{app.app_startdate}</td>
              <td class='date'>{app.app_enddate}</td>
              <td class='create'>{app.app_permit_create}</td>
              <td class='open'>{app.app_permit_open}</td>
              <td class='todo'>{app.app_permit_todolist}</td>
              <td class='doing'>{app.app_permit_doing}</td>
              <td class='done'>{app.app_permit_done}</td>
              <td class="description"><textarea disabled>{app.app_description}</textarea></td>
              <td class='action'><button on:click={()=>{viewAppDetails(app.app_acronym)}}>View Plans/Tasks</button></td>
          </tr>
          {/each}
      </tbody>
    </table>
      </div> 
  

</body>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 40px 0 auto auto;
  padding: 5px;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  width: 100vw;
  overflow-y: hidden;
}

.thead-container,
.tbody-container {
  overflow-x: auto; /* Allow horizontal scroll */
  border-collapse: collapse;

}


.scrollable-body {
  max-height: 750px; /* Set height for vertical scrolling */
  overflow-y: auto;  /* Enable vertical scroll */
  overflow-x: hidden; /* Prevent extra horizontal scrolling */
  display: inline-block;
  width: fit-content;
}

.tbody-container {
  margin-top: 0;
}

table {
  width: fit-content; /* Make the table take full width */
  table-layout: auto; /* Allow the table to auto-size based on content */
  border-collapse: collapse;
  margin: 0 20px 0 0;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: sticky;
  table-layout: fixed; 
}

thead {
  position: sticky;
}
th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  text-align: center;
  white-space: nowrap; /* Prevent cell content from wrapping */
}

th {
  background-color: #fafafa;
  color: #000;
  position: sticky;
  top: 0;
  font-size: 15px;
}

tr:hover {
  background-color: #f1f1f1;
}

.acronym {
  width:100px;
}
.rnumber {
  width:45px;
  text-wrap: wrap;
}
.date {
  width:123px;
}
.create, .open, .todo, .doing, .done {
  width: 150px; /* Remove fixed width to prevent cramping */
}
.description {
  width: 350px;
  white-space: nowrap; /* Prevent the description from wrapping */
  overflow: hidden;
  text-overflow: ellipsis;
}

.action {
  width:100px;
  text-wrap: wrap;
}

.dropdown-select {
  width: 100%; /* Make dropdowns responsive */
}

input[type="text"],
input[type="date"],
textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  width: 100%; /* Ensure inputs take full width */
}

textarea {
  height: 140px;
  resize: vertical;
}

textarea:disabled {
  height: 60px;
  resize: vertical;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

</style>
