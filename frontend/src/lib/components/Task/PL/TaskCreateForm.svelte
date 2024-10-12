<script lang='ts'>
  import Select from "svelte-select";
  import TaskForm from "../TaskForm.svelte";
  export let appAcronym:string="App1";
  export let taskState:string;
  export let plans:string[];
  export let taskCreator:string;
  export let taskOwner:string;
  let taskPlan:string=''

</script>

<TaskForm {taskState} {taskCreator} {taskOwner} taskNotes="">
  <div slot='task-name'>
    <input type="text" id="task-name" name="task-name" />
  </div>
 
  <label slot='task-id-label' for='App-Acronym'>App Acronym:</label>
  <p slot='task-id-value'>{appAcronym}</p>
  
  <div slot='task-plan' class='dropdown-select'>
    <Select items={plans} bind:value={taskPlan} />
    <input type="hidden" id="taskPlan" name="taskPlan" value={taskPlan} />
  </div>
  <textarea slot='task-description' id="description"></textarea>
  <div slot='existing-notes'></div>
  <textarea slot='add-note-input' id="notes"></textarea>
  <label slot='add-note-label' for="notes">add note:</label>
</TaskForm>


<style>

  input {
    height: 30px;
  }
</style>
