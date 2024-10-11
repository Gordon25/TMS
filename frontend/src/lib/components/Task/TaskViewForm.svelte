<script lang='ts'>
  import TaskForm from "./TaskForm.svelte";

  export let taskName:string;
  export let taskId:string;
  export let taskPlan:string;
  export let taskState:string;
  export let taskCreator:string;
  export let taskOwner:string;
  export let taskCreateDate:string;
  export let taskDescription:string;
  export let taskNotes:string;
  let isEdit = false
  $:console.log("IS edit ", isEdit)
</script>

<TaskForm {taskState} {taskCreator} {taskOwner} {taskNotes}>
  <p slot='task-name'>{taskName}</p>
  <label slot='task-id-label' for='task-id'>Task Id:</label>
  <p slot='task-id-value'>{taskId}</p>
  <p slot='task-plan'>{taskPlan}</p>
  <label slot='task-create-date-label' for='createDate'>Created On:</label>
  <p slot='task-create-date-value'>{taskCreateDate}</p>
  <p slot='task-description'>{taskDescription}</p>
  <div slot='third-btn'></div>
  <button class={isEdit?'save-btn':'edit-btn'} slot='first-btn' on:click={()=>{console.log('clicked!', isEdit); isEdit=(!isEdit)}}>{!isEdit?'Edit':'Save Changes'}</button>
  <!-- {#if isEdit}
  <label slot="add-note-label" for="notes">add note:</label>
  <textarea slot='add-note-input' id="notes"></textarea>
  {/if} -->
  {#if isEdit}
  <label slot="add-note-label" for="notes">Add note:</label>
  <textarea slot="add-note-input" id="notes"></textarea>
{/if}
</TaskForm>

<style>

</style>
