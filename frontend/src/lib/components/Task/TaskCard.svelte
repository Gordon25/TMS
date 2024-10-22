<script lang='ts'>
  import Modal from "../Modal.svelte";
  import EditTaskForm from "./EditTaskForm.svelte";
  export let token:string='';
  export let taskname:string;
  export let taskId:string;
  export let taskOwner:string;
  export let taskPlanColour:string;
  export let taskState:string;
  export let isPermitEdit
  let showForm=false
</script>
{#if showForm}
  <Modal closeModal={()=>{showForm=false}} bind:showModal={showForm}>
    <EditTaskForm on:close={()=>showForm=false} on:refresh on:stateUpdate {token} {taskId} {taskState} {isPermitEdit}/>
  </Modal>
{/if}
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="task-card" style="border-left-color: {taskPlanColour? taskPlanColour:'transparent'}; border-left-width:10px" on:click={()=>showForm=true}>
  <div class="task-details">
    <p class="task-id"><strong>Task ID:{taskId}</strong></p>
    <p class="task-name">{taskname}</p>
    <p class="task-owner">owner:{taskOwner}</p>
  </div>
</div>

<style>
.task-card {
  width: 200px; /* Adjust width as needed */
  background-color: #afd9e1; /* Light blue background */
  border: 1px solid #ccc; /* Light border around the card */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /*Optional shadow for depth*/
  display: flex;
  align-items: center;
  text-align: center;
  height:15%;
  position: relative;
  font-family: Arial, sans-serif;
  margin: 0 auto;
  justify-content: center;
  margin-bottom: 3%;
}

.task-details {
  flex-grow: 1; /* Make the task details grow and fill the card */
}

p {
  font-size: 16px;
  margin: 2% auto;
}

/* Optional: adding a small bar on the left */
.task-card:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 10px;
  /* background-color:var(--planColor); Darker color for the left bar */
  border-radius: 10px 0 0 10px; /* Rounded corner on the left */
}
</style>