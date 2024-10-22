<script lang="ts">
  import axiosInstance from "$lib/axiosConfig";
  import { onMount } from "svelte";
  import Select from "svelte-select"
  import Popup from "$lib/components/Popup.svelte"
  import { createEventDispatcher } from "svelte";
  export let appAcronym:string;
  export let token:string = '';
  let plans:string[];
  let taskname:string;
  let taskPlan:string;
  let taskState = '-';
  let taskCreator: string;
  let taskOwner: string;
  let taskDescription:string = '';
  let taskNotes:string = '';
  let createTaskResult:{success:boolean,field:string, message:string, taskname?:string, taskPlan?:string, taskDescription?:string, taskNotes?:string}|undefined
  let selectedPlan='';
  const dispatch = createEventDispatcher();
  const closeModal = ()=> {
    dispatch('close');
  }
  const refreshPage = ()=>{
    dispatch('refresh')
  }
  const closeForm = ()=>{
    refreshPage();
    closeModal();
  }
  const createTask = async()=> {
    await axiosInstance.post("/tasks",{
      appAcronym,
      taskname,
      taskPlan, 
      taskState, 
      taskCreator,
      taskOwner,
      taskDescription, 
      taskNotes
    },{
      headers:{
        Authorization: `Bearer ${token}`,
      },withCredentials:true
    }).then(res=>{createTaskResult=res.data})
    .catch(err=>console.log(err));
    taskname = createTaskResult?.taskname||''
    taskDescription = createTaskResult?.taskDescription||''
    taskNotes= createTaskResult?.taskNotes||''
    selectedPlan=''
  }

  const timeout = 3000
  $: {
    if (createTaskResult) {
      setTimeout(()=>{
        createTaskResult = undefined
      }, timeout)
    }
  }
  
  onMount(async()=>{
    const userResult = await axiosInstance.get("/user",{
      headers:{
        Authorization: `Bearer ${token}`,
      },withCredentials:true
    }).then(res=>res.data)
    .catch(err=>console.log(err))
    const {username} = userResult.data
    taskCreator = username;
    taskOwner = username;
    const plansData  = await axiosInstance.post('/appPlans', 
    {
      appAcronym
    },
    {
    headers:{
      Authorization:`Bearer ${token}`
    },
    withCredentials:true 
    }).then(res=>res.data);
    plans = plansData.data.map(plans=>plans.plan_mvp_name);
  })
</script>

<div class="form-container">
  {#if createTaskResult}
    <Popup message={createTaskResult.message} success={createTaskResult.success}/>
  {/if}
  <form>
    <div class="form-left">
      <div class="input-group">
        <div class='input-label'>
          <label for="task-name">Task name:</label>
        </div>
        <div class='input-value'>
           <input type='text' id='task-name' name='task-name' bind:value={taskname}/>
        </div>
      </div>
      <div class="input-group">
          <div class='input-label'>
            <label for="task-plan">Plan:</label>
          </div>
          <div class='input-value'>
              <div class='dropdown-select'>
                <Select items={plans} bind:justValue={taskPlan} bind:value={selectedPlan}/>
              </div>
          </div>
      </div>
      <div class="input-group">
        <div class='input-label'>
          <label for='label'>State:</label>
        </div>
        <div class='input-value'>
          <p>{taskState}</p>
        </div>
      </div>
      <div class="input-group">
        <div class='input-label'>
          <label for='creator'>Creator:</label>
        </div>
        <div class='input-value'>
          <p>{taskCreator}</p>
        </div>
      </div>
      <div class="input-group">
        <div class='input-label'>
          <label for='owner'>Owner:</label>
        </div>
        <div class='input-value'>
          <p>{taskOwner}</p>
        </div>
      </div>
      <div class="input-description-group">
        <div class='input-label'>
          <label for="description">Description:</label>
        </div>
        <div class='input-description'>
          <textarea id="description" maxlength="255" bind:value={taskDescription}></textarea>
        </div>
      </div>
    </div>
    <div class="vl"></div>
    <div class="form-right">
      <div class='add-notes-group'>
        <div class="add-notes-label">
          <label for='notes'>Add Notes:</label>
        </div>
        <div class="add-notes">
          <textarea id='notes' bind:value={taskNotes}></textarea>
        </div>
      </div>
    </div>
  </form>
    <div class="form-actions">
      <div class='third-btn-container'>
          <button class='third-btn' on:click={createTask}>Create Task</button>
      </div>
      <div class='fourth-btn-container'>
          <button class='fourth-btn' on:click={closeForm}>Cancel</button>
      </div>
    </div>
</div>

<style>

.form-container {
    margin: 0 auto;
    padding: 20px;
    background-color: #f4f4f4;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    height: 70vh;
    font-size: 18px;
  }

  form {
    display: grid;
    grid-template-columns: 0.30fr 0.01fr 0.65fr;
    gap: 20px;
    height: 100%;
    width: 100%;
  }

  .form-left {
    display: grid;
    flex-direction: column;
    gap:3%;
    grid-template-rows: 0.1fr 0.1fr 0.1fr 0.1fr 0.1fr 0.73fr;
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
    white-space: nowrap;
    font-size: 16px;
    display: flex;;
    justify-content: left;
  }

  .add-notes-group {
    height: 100%;
    display: flex;
    flex-direction: column;
    width: 95%;
    align-items: baseline;
    margin-left: 0;
    margin-bottom: 0;
  }

  .add-notes-label {
    margin-bottom: 10px;
  }

  .add-notes {
    height: 90%;
    width: 100%;
  }
input[type="text"],
textarea,
/* Target the dropdown select container */
.dropdown-select {
    /* Make the select as wide as the input fields */
    padding: 10px;
    border-radius: 5px;
  }
  .dropdown-select{
    padding-left: 0;
  }
  input[type='text'] {
    width: 70%;
  }

  .dropdown-select {
    width: 75%;
  }
  textarea {
    height: 100%;
    width: 100%;
    font-size: 18px;
    resize: none;
  }

  .input-description-group {
    height: 100%;
  }
  .input-description-group .input-label {
    margin-bottom: 10px;
  }
  .input-description-group .input-description {
    width: 95%;
    height: 100%;
  }

  .form-actions {
    grid-column: span 2;
    display: flex;
    justify-content: space-between;
    min-height: 6%;
    margin-left: 44.5%;
    width: 50%;
  }

  .form-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .form-actions :global(button) {
    padding: 10px 20px;
    background-color: #4a4a4a;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width:100%;
    height:100%;
    font-size: 18px;
  }  
  
  .third-btn-container {
    grid-column: 1;
  }

  .fourth-btn-container {
    grid-column: 2;
  }

  .third-btn {
    background-color: rgb(26, 202, 50);
  }

  .third-btn:hover {
    background-color: rgb(8, 163, 29); 
  }

  .fourth-btn {
    background-color: rgb(240, 69, 57);
  }

  .fourth-btn:hover {
    background-color: rgb(243, 98, 41);
  }

 .third-btn-container, .fourth-btn-container {
    width: 40%;
  }

  .vl {
    border-left: 2px solid #000;
    height: 100%;
    margin: 0 auto;
  }
</style>
