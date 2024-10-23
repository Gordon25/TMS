<script lang='ts'>
import Modal from "$lib/components/Modal.svelte";
import type { PageServerData } from "./$types";
import PlanTable from "$lib/components/Plan/PlanTable.svelte";
import { onMount} from "svelte";
import axiosInstance from "$lib/axiosConfig.ts";
import CreateTaskForm from "$lib/components/Task/CreateTaskForm.svelte";
import TaskCard from "$lib/components/Task/TaskCard.svelte";
import Popup from "$lib/components/Popup.svelte";
import { goto } from "$app/navigation";
export let data:PageServerData
let createPlanSuccessMsg:string|undefined;
let showPlanModal = false
let showTaskModal = false
let appAcronym='';
let token;
let openTasks:taskInfo[]=[], todoTasks:taskInfo[]=[], doingTasks:taskInfo[]=[], doneTasks:taskInfo[]=[], closedTasks:taskInfo[]=[];
let isPermitCreate:boolean, isPermitOpen:boolean, isPermitTodo:boolean, isPermitDoing:boolean, isPermitDone:boolean;
let updateTaskStateMessage:string|undefined;
const handleTaskStateUpdate = (event:Event) => {
  updateTaskStateMessage = event.detail.message;
}

$:({token, isUserPM} = data);
  const timeout= 3000;
  $:{
    if (createPlanSuccessMsg) {
      setTimeout(()=>{
        createPlanSuccessMsg = undefined;
      }, timeout)
    }

    if (updateTaskStateMessage) {
      setTimeout(()=>{
        updateTaskStateMessage = undefined;
      }, timeout)
    }
  }
  const getAppTasks = async()=>{
    await axiosInstance.post("/appTasks",{
    appAcronym
  },{
    withCredentials:true
  }).then(res=>{
    let data = res.data
    openTasks=data.open
    todoTasks=data.todo
    doingTasks=data.doing
    doneTasks=data.done
    closedTasks=data.closed})
    .catch((error) => {
      if (error.status === 401) {
        goto("/login");
      } else {
        console.log(error.status);
      }
    });
  }

onMount(async()=> {
  appAcronym = localStorage.getItem('app')||'';
  await getAppTasks();
  await axiosInstance.post("/taskPermissions",{
    appAcronym
  },{
    withCredentials:true
  }).then(res=>{
    let data=res.data;
    ({isPermitCreate, isPermitOpen, isPermitTodo, isPermitDoing, isPermitDone}=data)
  })
})
$:console.log(isPermitCreate, isPermitOpen, isPermitTodo, isPermitDoing, isPermitDone)
</script>

{#if showPlanModal}
<Modal closeModal={()=>{(showPlanModal=false)}} bind:showModal={showPlanModal} on:closeModal={getAppTasks}>
  <PlanTable {token} appAcronym={appAcronym}/>
</Modal>
{/if}
{#if showTaskModal}
<Modal closeModal={()=>{(showTaskModal=false)}} bind:showModal={showTaskModal} on:closeModal={getAppTasks}>
  <CreateTaskForm on:refresh={getAppTasks} on:close={()=>{showTaskModal=false}} appAcronym={appAcronym} {token}/>
</Modal>
{/if}
<body>
  <main>
      <section class="app-header">
          <h1>{appAcronym}</h1>
      </section>
      {#if updateTaskStateMessage} 
        <div class='popup'>  
            <Popup message={updateTaskStateMessage} success={true}/>
        </div>
      {/if} 
      <div class="actions">
        {#if isPermitCreate}
          <button class="btn" on:click={()=>{showTaskModal=true}}>Create Task</button>
        {/if}
        <button class="btn" on:click={()=>{showPlanModal=true}}>Plans</button>  
      </div>
      <section class="task-board">
          <div class="column">
              <h2>Open</h2>
              {#each openTasks as openTask}
                <TaskCard on:refresh={getAppTasks} on:closeModal={getAppTasks} on:stateUpdate={handleTaskStateUpdate} {token} taskname={openTask.task_name} taskId={openTask.task_id} taskOwner={openTask.task_owner} taskPlanColour={openTask.plan_colour} isPermitEdit={isPermitOpen} taskState={openTask.task_state}/>
              {/each}    
          </div>
          <div class="column">
              <h2>Todo</h2>
              {#each todoTasks as todoTask}
              <TaskCard on:refresh={getAppTasks} on:closeModal={getAppTasks} on:stateUpdate={handleTaskStateUpdate} {token} taskname={todoTask.task_name} taskId={todoTask.task_id} taskOwner={todoTask.task_owner} taskPlanColour={todoTask.plan_colour} isPermitEdit={isPermitTodo} taskState={todoTask.task_state}/>
            {/each}  
          </div>
          <div class="column">
              <h2>Doing</h2>
              {#each doingTasks as doingTask}
              <TaskCard on:refresh={getAppTasks} on:closeModal={getAppTasks} on:stateUpdate={handleTaskStateUpdate} {token} taskname={doingTask.task_name} taskId={doingTask.task_id} taskOwner={doingTask.task_owner} taskPlanColour={doingTask.plan_colour} isPermitEdit={isPermitDoing} taskState={doingTask.task_state}/>
            {/each} 
          </div>
          <div class="column">
              <h2>Done</h2>
              {#each doneTasks as doneTask}
              <TaskCard on:refresh={getAppTasks} on:closeModal={getAppTasks} on:stateUpdate={handleTaskStateUpdate} {token} taskname={doneTask.task_name} taskId={doneTask.task_id} taskOwner={doneTask.task_owner} taskPlanColour={doneTask.plan_colour} isPermitEdit={isPermitDone} taskState={doneTask.task_state}/>
            {/each} 
          </div>
          <div class="column">
              <h2>Closed</h2>
              {#each closedTasks as closedTask}
              <TaskCard on:refresh={getAppTasks} on:closeModal={getAppTasks} on:stateUpdate={handleTaskStateUpdate} {token} taskname={closedTask.task_name} taskId={closedTask.task_id} taskOwner={closedTask.task_owner} taskPlanColour={closedTask.plan_colour} isPermitEdit={false} taskState={closedTask.task_state}/>
            {/each} 
          </div>
      </section>
  </main>
</body>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

body {
    background-color: #f4f4f4;
    height: 91vh;
    margin-top: 40px;
    width: fit-content;
    overflow: auto;
    display: flex;
    justify-content: center; /* Horizontally centers the main */
}

main {
    margin: 5px auto;
    overflow: hidden; 
    width: 1900px;
    padding: 10px;
}

.app-header {
    display: grid;
    grid-column: 2;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    margin-right: 90%;
    gap:10%;
}

.app-header h1 {
    margin-left: 25%;
    font-size: 36px;
}

.actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.btn {
    background-color: #555;
    color: #fff;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    margin-left: 10px;
    border-radius: 5px;
}
.popup {
  max-width: fit-content;
  margin: auto auto;
}
.task-board {
    display: flex;
    justify-content: space-between;
    height: 100%;
    flex-grow: 1;
}

.column {
    background-color: #d3d3d3;
    width: 19%;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    height: 100%;
}

.column h2 {
    font-size: 18px;
    border-bottom: 2px solid black;
    padding-bottom: 10px;
    margin-bottom: 5px;
}

</style>