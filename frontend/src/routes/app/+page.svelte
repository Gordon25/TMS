<script lang='ts'>
import Modal from "$lib/components/Modal.svelte";
import AppViewCard from "$lib/components/App/AppViewCard.svelte";
import type { PageServerData } from "./$types";
import PlanTable from "$lib/components/Plan/PlanTable.svelte";
import { onMount} from "svelte";
import axiosInstance from "$lib/axiosConfig";
import { invalidate } from "$app/navigation";
export let data:PageServerData
let createPlanSuccessMsg:string|undefined;
let showAppModal = false
let showPlanModal = false
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
let plans:Plan[];
let token;

const closeAppModal = ()=>{
  showAppModal = false;
}
const openAppModal = ()=> {
  showAppModal=true;
}
const closePlanModal = () => {
    showPlanModal = false
}
const openPlanModal = () => {
    showPlanModal = true
}

$:({token} = data);
  const timeout= 3000;
  $:{
    if (createPlanSuccessMsg) {
      setTimeout(()=>{
        createPlanSuccessMsg = undefined;
      }, timeout)
    }
  }

onMount(async()=>{
  app.app_acronym = localStorage.getItem('app')||'';
  const appData = await axiosInstance.post('/app',
  {
    appAcronym:app.app_acronym
  },
  {
   headers:{
    Authorization:`Bearer ${token}`
   },
   withCredentials:true 
  }).then(res=>res.data)
  app = appData.data[0]
 const plansData  = await axiosInstance.post('/appPlans', 
  {
    appAcronym:app.app_acronym
  },
  {
   headers:{
    Authorization:`Bearer ${token}`
   },
   withCredentials:true 
  }).then(res=>res.data)
  
  plans = plansData.data;
  
})
</script>
{#if showAppModal}
<Modal closeModal={closeAppModal} bind:showModal={showAppModal}>
  <AppViewCard appAcronym={app.app_acronym} startDate={app.app_startdate} endDate={app.app_enddate}
  description={app.app_description} createGroup={app.app_permit_create} openGroup={app.app_permit_open}
  todoGroup={app.app_permit_todolist} doingGroup={app.app_permit_doing} doneGroup={app.app_permit_done}/>
</Modal>
{/if}
{#if showPlanModal}
<Modal closeModal={closePlanModal} bind:showModal={showPlanModal}>
    <PlanTable {plans} {token} appAcronym={app.app_acronym}/>
</Modal>
{/if}
<body>
  <main>
      <section class="app-header">
          <h1>{app.app_acronym}</h1>
          <button on:click={openAppModal}>View App Details</button>
      </section>
      
      <div class="actions">
        
          <button class="btn" on:click={openPlanModal}>Plans</button>
          <button class="btn">Create Task</button>
      </div>
      
      <section class="task-board">
          <div class="column">
              <h2>Open</h2>    
          </div>
          <div class="column">
              <h2>Todo</h2>
          </div>
          <div class="column">
              <h2>Doing</h2>
          </div>
          <div class="column">
              <h2>Done</h2>
          </div>
          <div class="column">
              <h2>Closed</h2>
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
    height: 100vh;
    margin-top: 80px;
}

main {
    max-width: 100vw;
    margin: 5px auto;
    padding: 10px;
    height:99%;
    overflow: hidden; 
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
    font-size: 24px;
}

.app-header button {
    text-decoration: none;
    width:90%;
    color: #000;
    font-size: 16px;
    margin-right:79%;
    background-color: transparent;
}
.app-header button:hover {
  background-color:blue
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

.task-board {
    display: flex;
    justify-content: space-between;
    height: 80%;
}

.column {
    background-color: #d3d3d3;
    width: 19%;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    
}

.column h2 {
    font-size: 18px;
    border-bottom: 2px solid black;
    padding-bottom: 10px;
    margin-bottom: 5px;
}

.child {
    margin-bottom: 6px; /* Adds 20px spacing between child elements */
}

/* Optionally, you can remove margin on the last child */
.child:last-child {
    margin-bottom: 0; /* Removes bottom margin from the last child */
}
</style>