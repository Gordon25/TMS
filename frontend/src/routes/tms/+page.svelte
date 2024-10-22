<script lang='ts'>
  import type { PageServerData } from "./$types";
  import Popup from "$lib/components/Popup.svelte"
  import Select from "svelte-select";
  import { goto, invalidateAll } from "$app/navigation";
  import { PUBLIC_APP_INIT_RNUMBER } from "$env/static/public";
  import axiosInstance from "$lib/axiosConfig";
  import Modal from "$lib/components/Modal.svelte";
  import AppForm from "$lib/components/App/AppForm.svelte";
  let showAppModal = false;
  let apps:App[];
  let groups:string[];
  let token:string;
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
  let displayedAppAcronym:string='';
  export let data:PageServerData
  let createAppSuccessResult:{success:boolean, field:string, message:string}|undefined;

  const viewAppDetails = (app_acronym:string)=>{
    localStorage.setItem('app', app_acronym); 
    goto('/app');
  }
  const autoExpandTextArea = (event:Event)=>{
    const element = event.target as HTMLTextAreaElement;
    element.style.height = '150px';
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
      invalidateAll();
      appAcronym=''
      startDate=''
      endDate=''
      description=''
      createGroup=''
      openGroup=''
      todoGroup=''
      doingGroup=''
      doneGroup=''
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
  {#if showAppModal}
  <Modal closeModal={()=>{showAppModal=false}} bind:showModal={showAppModal} on:closeModal={invalidateAll}>
    <AppForm isCreate={false} on:close={()=>{showAppModal=false}} {token} appAcronym={displayedAppAcronym}/>
  </Modal>
  {/if}
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
              <th class='view-details'></th>
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
            <Select items={groups} bind:justValue={createGroup} />
          </div>
          {#if createAppSuccessResult && createAppSuccessResult.field==='create'}
          <Popup message={createAppSuccessResult.message} success={createAppSuccessResult.success}/>
          {/if}
        </td>
        <td class='open'>
          <div class='dropdown-select' style='--width=10%'>
            <Select items={groups} bind:justValue={openGroup}/>
          </div>
        </td>
        <td class='todo'>
          <div class='dropdown-select'>
            <Select items={groups} bind:justValue={todoGroup} />
          </div>
        </td>
        <td class='doing'>
          <div class='dropdown-select'>
            <Select items={groups} bind:justValue={doingGroup} />
          </div>
        </td>
        <td class='done'>
          <div class='dropdown-select'>
            <Select items={groups} bind:justValue={doneGroup} />
          </div>
        </td>
        <td class='description'><textarea id="description" bind:value={description} maxlength="255" on:input={autoExpandTextArea}></textarea></td>
        <td class='action'><button on:click|preventDefault={createApp}>Create App</button></td>
        <td class='view-details'></td>
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
              <td class="description">{app.app_description}</td>
              <td class='view-details'><button on:click={()=>{displayedAppAcronym=app.app_acronym; showAppModal=true;}}>View Details</button></td>
              <td class='action'><button on:click={()=>{viewAppDetails(app.app_acronym)}}>View App</button></td>
          </tr>
          {/each}
      </tbody>
    </table>
      </div> 
  

</body>

<style>
  /* Body styling */
  body {
    font-family: Arial, sans-serif;
    margin-top: 40px;
    padding: 5px;
    background-color: #f4f4f4;
    display: flex;
    flex-direction: column;
    width: 98vw;
    position:fixed;
    overflow-y: hidden;
    overflow-x: scroll;
  }


  .thead-container, .tbody-container {
  width: 100%;
  overflow-x: scroll;
  table-layout: fixed;
  border-collapse: collapse;
  margin-bottom: 0;
}

  .scrollable-body {
    max-height: 750px; /* Set your height */
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scroll if not needed */
  }

  .tbody-container {
    margin-top: 0;
  }
  /* Table styles */
  table {
    width: 100%;
    min-width: 1000px; /* Set a minimum width for large content */
    border-collapse: collapse;
    margin: 20px 0;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    text-align: center;
  }

  th {
    background-color: #fafafa;
    color: #000;
    position: sticky;
    top: 0;
    font-size: 15px;
    text-wrap: wrap;
  }

  tr:hover {
    background-color: #f1f1f1; /* Highlight row on hover */
  }

  .dropdown-select {
    --width: 150px; /**Set the desired fixed width*/
    --wrap-text: wrap;
  }
  .acronym {
    width: 5%;
  }

  .rnumber {
    width: 2.4%;
  }
  .date {
    width: 6.5%;
  }

  .create {
    width:7%;
  }
  .open {
    width:7%;
  }
  .todo {
    width:7%;
  }
  .doing {
    width:7%;
  }
  .done {
    width:7%;
  }

  .description {
    width: 18%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }



  /* Responsive inputs */
  input[type="text"],
  input[type="date"],
  textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    width: 100%;
  }
  
  input[type='text'] {
    overflow-x: hidden;
    word-wrap: break-word;
    width: 120%;
  }
  
  textarea {
    resize: vertical;
    height: 150px;
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
