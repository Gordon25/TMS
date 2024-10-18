<script lang="ts">
  import axiosInstance from "$lib/axiosConfig";
  import { onMount } from "svelte";
  import Select from "svelte-select"
  import Popup from "$lib/components/Popup.svelte"
  import { createEventDispatcher } from "svelte";
  export let token:string = '';
  export let plans:string[]=[];
  export let taskState:string;
  export let isPermitEdit:boolean;
  export let taskId:string;
  export let selectedPlan='';
  let task:Task={task_id:'',
                task_name:'',
                task_plan:'',
                task_state:'',
                task_creator:'',
                task_owner:'',
                task_createdate:'',
                task_description:'',
                task_notes:'',
                task_app_acronym:''};
  let taskPlan:string|undefined;
  let taskNotes:string='';
  let isPlanChanged:boolean;
  $:{isPlanChanged=((taskPlan!==undefined && taskPlan!=="") && (taskPlan!=task.task_plan))
  console.log("IS PLAN CHANGED ", taskPlan===undefined,taskPlan==='',taskPlan,"is changed? ", isPlanChanged)}
  let updateTaskResult:{success:boolean, message:string}|undefined;
  const dispatch = createEventDispatcher();
  const closeModal = ()=> {
    dispatch('close');
  }
  const refreshPage = () =>{
    dispatch('refresh');
  }
  const updateTaskNotes = async()=> {
    const updateTaskNotesResult = await axiosInstance.put("/taskNotes",{
      taskId:task.task_id,
      taskNotes,
      taskState:task.task_state,
    },{
      headers:{
        Authorization: `Bearer ${token}`,
      },withCredentials:true
    }).then(res=>res.data)
    .catch(err=>console.log(err));
    taskNotes='';
    return updateTaskNotesResult
  }
  const updateTaskPlan = async()=> {
    const updateTaskPlanResult = await axiosInstance.put("/updateReleaseTaskPlan",{
      taskId:task.task_id,
      taskPlan
    },{
      headers:{
        Authorization: `Bearer ${token}`,
      },withCredentials:true
    }).then(res=>res.data)
    .catch(err=>console.log(err));
    taskPlan=undefined;
    return updateTaskPlanResult.data
  }
  const getTask = async() =>{
    return await axiosInstance.post('/task',{
      taskId
    },{
      headers:{
        Authorization: `Bearer ${token}`,
      },withCredentials:true
    }
  ).then(res=>res.data.data[0])
  .catch(err=>console.log(err))
  }

  const updateTaskState = async(willPromote=true)=>{
    await axiosInstance.put('/updateOpenTaskState',{
      taskId:task.task_id,
      taskState:task.task_state,
      willPromote
    },{
      headers:{
        Authorization: `Bearer ${token}`,
      },withCredentials:true
    }).then(res=>res.data)
  }
  const saveChanges=async()=>{
    updateTaskResult=await updateTaskNotes();
    task = await getTask();
  }
  const saveAndRelease=async()=>{
    await updateTaskNotes(); //combind to 1 call 
    await updateTaskPlan();
    await updateTaskState();
    closeModal();
    refreshPage();
  }
  const saveAndPromote=async()=>{
    await updateTaskNotes();
    await updateTaskState();
    closeModal();
    refreshPage();
  }
  const saveAndGiveUp=async()=>{
    await updateTaskNotes();
    await updateTaskState(false);
    closeModal();
    refreshPage();
  }
  const saveAndReject = async()=>{
    await updateTaskNotes();
    await updateTaskPlan();
    await updateTaskState(false);
    closeModal();
    refreshPage();
  }
  const closeForm=async()=>{
    closeModal();
    refreshPage();
  }
  onMount(async()=>{
  task = await getTask()
  console.log(taskState, isPermitEdit)
  if ((taskState==='Open' ||taskState==='Done') && isPermitEdit) {
    const plansData  = await axiosInstance.post('/appPlans', 
    {
      appAcronym:task.task_app_acronym
    },
    {
    headers:{
      Authorization:`Bearer ${token}`
    },
    withCredentials:true 
    }).then(res=>res.data);
    plans = plansData.data.map(plans=>plans.plan_mvp_name);
  }
  })

  const timeout = 3000
  $: {
    if (updateTaskResult) {
      setTimeout(()=>{
        updateTaskResult = undefined
      }, timeout)
    }
  }
  
</script>
{#if updateTaskResult}
    <Popup message={updateTaskResult.message} success={updateTaskResult.success}/>
  {/if}
<div class="form-container">
  <form>
    <div class="form-left">
      <div class="input-group">
        <div class='input-label'>
          <label for="task-name">Task name:</label>
        </div>
        <div class='input-value'>
           <p>{task.task_name}</p>
        </div>
      </div>
      <div class='input-group'>
        <div class='input-label'>
          <label for='task-id'>Task ID:</label>
        </div>
        <div class='input-value'>
          <p>{task.task_id}</p>
        </div>
      </div>
      <div class="input-group">
          <div class='input-label'>
            <label for="task-plan">Plan MVP name:</label>
          </div>
          <div class='input-value'>
            {#if isPermitEdit && (task.task_state==='Open' || task.task_state==='Done')}
              <div class='dropdown-select'>
                <Select items={plans} bind:justValue={taskPlan} bind:value={selectedPlan}/>
              </div>
            {:else}
              <p>{task.task_plan}</p>
            {/if}
          </div>
      </div>
      <div class="input-group">
        <div class='input-label'>
          <label for='label'>State:</label>
        </div>
        <div class='input-value'>
          <p>{task.task_state}</p>
        </div>
      </div>
      <div class="input-group">
        <div class='input-label'>
          <label for='creator'>Creator:</label>
        </div>
        <div class='input-value'>
          <p>{task.task_creator}</p>
        </div>
      </div>
      <div class="input-group">
        <div class='input-label'>
          <label for='owner'>Owner:</label>
        </div>
        <div class='input-value'>
          <p>{task.task_owner}</p>
        </div>
      </div>
      <div class="input-group">
        <div class='input-label'>
          <label for='owner'>Created On:</label>
        </div>
        <div class='input-value'>
          <input type='date' value={task.task_createdate} disabled/>
        </div>
      </div>
      <div class="input-description">
        <div class='input-label'>
          <label for="description">Description:</label>
        </div>
          <p>{task.task_description}</p>
      </div>
    </div>
    <div class="vl"></div>
    <div class="form-right">
      <div class='existing-notes'>
      <div class='existing-notes-label'>
        <label for='existing-notes-label'>Notes:</label>
      </div>
      <div class='notes-container'>
        <textarea value={task.task_notes} disabled></textarea>
      </div>
      </div>
      {#if task.task_state!=='Closed' && isPermitEdit}
      <div class='new-notes'>
      <div class='new-notes-label'>
        <label for='notes'>Add Notes:</label>
      </div>
      <div class="notes-container">
      <textarea id='notes' bind:value={taskNotes} placeholder="add note"></textarea>
      </div>
    </div>
    {/if}
    </div>
  </form>
    {#if isPermitEdit}
    <div class="form-actions">
        <div class='first-btn-container'>
          {#if task.task_state==='Doing'}
          <button class="red-btn" on:click={saveAndGiveUp}>Save and Giveup</button>
          {:else if task.task_state==='Done'}
          <button class="green-btn" on:click={saveAndPromote} disabled={isPlanChanged}>Save and Approve</button> 
          {/if}
      </div>
      <div class='second-btn-container'>
        {#if task.task_state==='Todo'}
        <button class='green-btn' on:click={saveAndPromote}>Save and pick up</button>
        {:else if task.task_state==='Doing'}
        <button class="green-btn" on:click={saveAndPromote}>Save and Seek Approval</button>
        {:else if task.task_state==='Done'}
        <button class="red-btn" on:click={saveAndReject}>Save and Reject</button> 
        {/if}
      </div>
      <div class='third-btn-container'>
          {#if task.task_state==='Open'}
          <button  on:click|preventDefault={saveAndRelease}>Save and Release</button>
          {:else if task.task_state!=='Closed' && isPermitEdit}
          <button on:click|preventDefault={saveChanges} disabled={task.task_state==='Done'&&isPlanChanged}>Save Changes</button>
          {/if}
      </div>
      <div class='fourth-btn-container'>
          {#if isPermitEdit}
          <button class='fourth-btn' on:click={closeForm}>Cancel</button>
          {/if}
      </div>
    </div>
    {/if}
</div>

<style>
  .form-container {
    margin: 0 auto;
    padding: 20px;
    background-color: #f4f4f4;
    border-radius: 10px;
    height: 70vh;
    display: flex;
    flex-direction: column;
  }

  form {
    display: grid;
    grid-template-columns: 0.30fr 0.01fr 0.65fr;
    gap: 20px;
    height: 100%;
    width: 100%;
  }

  .form-left {
    display: flex;
    flex-direction: column;
  }

  label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }

  .input-group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .input-label {
    width: 30%;
    white-space: nowrap;
    font-size: 16px;
    display: flex;;
    justify-content: left;
  }

  .input-value {
    width: 67%;
    display: flex;
    justify-content: left;
  }

  input[type="text"],
  input[type="date"],
  textarea,
  .dropdown-select {
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    font-size: 16px;
    box-sizing: border-box;
  }

  .dropdown-select {
    padding-left: 0;
  }

  textarea {
    resize: none;
    height: 100px;
    width: 100%;
    font-size: 16px;
  }

  .input-description {
    margin-top: 20px;
  }

  .input-description .input-label {
    margin-bottom: 10px;
  }

  .form-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .existing-notes,
  .new-notes {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }

  .new-notes {
    height: 200%;
  }

  .existing-notes-label {
    display: flex;
    justify-content: left;
  }

  .new-notes-label {
    display: flex;
    justify-content: left;
  }
  
  .notes-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  }

  textarea {
  flex-grow: 1;
  font-size: 16px;
  padding: 10px;
  resize: none;
  }

  .existing-notes-label,
  .new-notes-label {
    margin-bottom: 10px;
  }

  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  .form-actions :global(button) {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    font-size: 16px;
    background-color: #000;
    color:white
  }

  .form-actions :global(button:hover) {
    background-color: #4e4747;
  }

  .form-actions :global(button:disabled) {
    background-color: #d2cfcf;
  }

  .green-btn {
    background-color: #1aca32;
  }

  .green-btn:hover {
    background-color: #08a31d;
  }

  .green-btn:disabled {
    background-color: #d2cfcf;
  }

  .red-btn {
    background-color: #f04539;
  }

  .red-btn:hover {
    background-color: #f36229;
  }

  .first-btn-container,
  .second-btn-container,
  .third-btn-container,
  .fourth-btn-container {
    width: 23%;
  }

  .vl {
    border-left: 2px solid #000;
    height: 100%;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .form-container {
      height: auto;
    }

    form {
      grid-template-columns: 1fr;
    }

    .vl {
      display: none;
    }

    .first-btn-container,
    .second-btn-container,
    .third-btn-container,
    .fourth-btn-container {
      width: 100%;
      margin-bottom: 10px;
    }

    .form-actions {
      flex-direction: column;
    }
  }
</style>

