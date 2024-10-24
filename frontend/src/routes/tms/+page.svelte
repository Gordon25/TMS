<script lang='ts'>
  import type { PageServerData } from "./$types";
  import Popup from "$lib/components/Popup.svelte"
  import Select from "svelte-select";
  import { goto, invalidateAll } from "$app/navigation";
  import axiosInstance from "$lib/axiosConfig.ts";
  let apps:App[];
  let groups:string[];
  let isUserPL:boolean;
  let appAcronym:string='';
  let rNumber=0;
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
  let editSelectedCreate='';
  let editSelectedOpen='';
  let editSelectedTodo='';
  let editSelectedDoing='';
  let editSelectedDone='';
  export let data:PageServerData
  const emptyApp:App = {
    app_acronym:'',
    app_rnumber:'',
    app_startdate:'',
    app_enddate:'',
    app_description:'',
    app_permit_create:'',
    app_permit_open:'',
    app_permit_todolist:'',
    app_permit_doing:'',
    app_permit_done:''
  }
  let createAppSuccessResult:{success:boolean, field:string, message:string}|undefined;
  let updateAppResult:{success:boolean,field:string, message:string}|undefined
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
  let currentApp:App = {...emptyApp}

  const editApp = (app:App) =>{
    currentApp = {...app};
    editSelectedCreate=currentApp.app_permit_create;
    editSelectedOpen=currentApp.app_permit_open;
    editSelectedTodo=currentApp.app_permit_todolist;
    editSelectedDoing=currentApp.app_permit_doing;
    editSelectedDone=currentApp.app_permit_done;
    console.log(currentApp)
  }

  const resetApp = () =>{
    currentApp = {...emptyApp}
    editSelectedCreate="";
    editSelectedOpen="";
    editSelectedTodo="";
    editSelectedDoing="";
    editSelectedDone="";
  }

  const updateApp = async() =>{
    const updateAppRes = await axiosInstance
    .put(
      '/apps',{
        appAcronym:currentApp.app_acronym,
        startDate:currentApp.app_startdate,
        endDate:currentApp.app_enddate,
        description:currentApp.app_description,
        create:currentApp.app_permit_create,
        open:currentApp.app_permit_open,
        todo:currentApp.app_permit_todolist,
        doing:currentApp.app_permit_doing,
        done:currentApp.app_permit_done,
      },
      {
        withCredentials:true
      }
    ).then((res) => {
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
    const {success} = updateAppRes;
    if (success) {
      invalidateAll();
      resetApp();
    }
    updateAppResult = updateAppRes;
    
  }
  const createApp = async ()=> {
    const createAppResult = await axiosInstance
      .post(
        `/apps`,
        {
          appAcronym,
          rNumber,
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
      rNumber=0
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
    if (updateAppResult) {
      setTimeout(()=>{
        updateAppResult = undefined;
      }, timeout)
    }
  }
  $:console.log(updateAppResult)
  $: {
    if (currentApp.app_permit_create === undefined) {
      currentApp.app_permit_create = ''
    }
    if (currentApp.app_permit_open === undefined) {
      currentApp.app_permit_open = ''
    }
    if (currentApp.app_permit_todolist === undefined) {
      currentApp.app_permit_todolist = ''
    }
    if (currentApp.app_permit_doing === undefined) {
      currentApp.app_permit_doing = ''
    }
    if (currentApp.app_permit_done === undefined) {
      currentApp.app_permit_done = ''
    }
  }
</script>
<body>
  {#if createAppSuccessResult && createAppSuccessResult.field==='app'}
    <Popup message={createAppSuccessResult.message} success={createAppSuccessResult.success}/>
  {/if}
  {#if updateAppResult && updateAppResult.field==='app'}
  <Popup message={updateAppResult.message} success={updateAppResult.success}/>
  {/if}
  <form id='create'></form>
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
        <td class='rnumber'>
          <input type='text' id='rnumber' name='rnumber' bind:value={rNumber} />
          {#if createAppSuccessResult && createAppSuccessResult.field==='rnumber'}
          <Popup message={createAppSuccessResult.message} success={createAppSuccessResult.success}/>
          {/if}
        </td>
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
              <td class='date'>
              {#if currentApp.app_acronym === app.app_acronym}
              <input type="date" id="start-date" name="start-date" bind:value={currentApp.app_startdate}/>
              {#if updateAppResult && updateAppResult.field==='start date'}
                <Popup message={updateAppResult.message} success={updateAppResult.success}/>
              {/if}
              {:else}
                {app.app_startdate}
              {/if}
              </td>
              <td class='date'>
                {#if currentApp.app_acronym === app.app_acronym}
                <input type="date" id="end-date" name="end-date" bind:value={currentApp.app_enddate}/>
                {#if updateAppResult && updateAppResult.field==='end date'}
                <Popup message={updateAppResult.message} success={updateAppResult.success}/>
                {/if}
                {:else}
                  {app.app_enddate}
                {/if}               
              </td>
              <td class='create'>
                {#if currentApp.app_acronym === app.app_acronym}
                <div class='dropdown-select'>
                  <Select items={groups} bind:justValue={currentApp.app_permit_create} bind:value={editSelectedCreate}/>
                </div>
                {:else}
                {app.app_permit_create}
                {/if}
              </td>
              <td class='open'>
                {#if currentApp.app_acronym === app.app_acronym}
                <div class='dropdown-select'>
                  <Select items={groups} bind:justValue={currentApp.app_permit_open} bind:value={editSelectedOpen} />
                </div>
                {:else}
                {app.app_permit_open}
                {/if}
              </td>
              <td class='todo'>
                {#if currentApp.app_acronym === app.app_acronym}
                <div class='dropdown-select'>
                  <Select items={groups} bind:justValue={currentApp.app_permit_todolist} bind:value={editSelectedTodo}/>
                </div>
                {:else}
                {app.app_permit_todolist}
                {/if}
              </td>
              <td class='doing'>
                {#if currentApp.app_acronym === app.app_acronym}
                <div class='dropdown-select'>
                  <Select items={groups} bind:justValue={currentApp.app_permit_doing} bind:value={editSelectedDoing}/>
                </div>
                {:else}
                {app.app_permit_doing}
                {/if}
              </td>
              <td class='done'>
                {#if currentApp.app_acronym === app.app_acronym}
                <div class='dropdown-select'>
                  <Select items={groups} bind:justValue={currentApp.app_permit_done} bind:value={editSelectedDone}/>
                </div>
                {:else}
                {app.app_permit_done}
                {/if}
              </td>
              <td class="description">
                {#if currentApp.app_acronym === app.app_acronym}
                <textarea bind:value={currentApp.app_description} maxlength="255" on:input={autoExpandTextArea}></textarea>
                {:else}
                <textarea disabled>{app.app_description}</textarea>
                {/if}
              </td>
              <td class='action'>
              {#if currentApp.app_acronym === app.app_acronym}
                <button class='update-btn' on:click={updateApp}>Save Changes</button>
                <button class='cancel-btn' on:click={resetApp}>Cancel</button>
              {:else}
                <button on:click={()=>{viewAppDetails(app.app_acronym)}}>View Plans/Tasks</button>
                <button on:click={()=>editApp(app)}>Edit App</button>
              {/if}
              </td>
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
  width:80px;
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

.action > * {
  margin-bottom: 10px;
}

.dropdown-select {
  width: 100%; /* Make dropdowns responsive */
}

input[type="text"],
input[type="date"],
input[type='number'],
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

.update-btn {
  background-color: #1eba0c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-btn {
  background-color: #ca4b0b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.update-btn:hover {
    background-color: #5cde21;
  }
  .cancel-btn:hover {
    background-color: #ec7134;
  }
button:hover {
  background-color: #0056b3;
}

</style>
