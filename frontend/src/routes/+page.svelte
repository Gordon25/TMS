<script>
import logout from "$lib/logout";
import AppCard from "$lib/components/AppCard.svelte";
import AppForm from "$lib/components/App/AppForm.svelte";
  import TaskCard from "$lib/components/Task/TaskCard.svelte";
  let groups= ['PL','Admin','PM','Dev'];
import TaskForm from "$lib/components/Task/TaskForm.svelte";
  import TaskCreateForm from "$lib/components/Task/PL/TaskCreateForm.svelte";
  import TaskReleaseForm from "$lib/components/Task/PM/TaskPMReleaseForm.svelte";
  import TaskEditForm from "$lib/components/Task/TaskEditForm.svelte";
  import TaskChangePlanningStatusForm from "$lib/components/Task/PM/TaskPMChangePlanningStatusForm.svelte";
  import TaskDevPickUpForm from "$lib/components/Task/TaskDevPickUpForm.svelte";
  import TaskViewForm from "$lib/components/Task/TaskViewForm.svelte";
  import TaskDevSeekApprovalGiveUpForm from "$lib/components/Task/Dev/TaskDevSeekApprovalGiveUpForm.svelte";
let notes = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
let task = {
  appAcronym:"App1",
  plans:["PL1"],
  taskState:"Created",
  taskCreator:"PL1",
  taskOwner: "PL1",
  taskNotes:""};
</script>

<body>
  <!-- <AppCard appAcronym='App1' startDate='2024/09/03' endDate='2024/09/10'/> -->
  <!-- <AppForm createGroups={groups} openGroups={groups} todoGroups={groups} doingGroups={groups} doneGroups={groups}/> -->
   <!-- <TaskCard taskId="App1_1" taskName="First Task" taskOwner="user1" --planColor="#E1EE48"/> -->
  <!-- <TaskForm appAcronym={task.appAcronym} taskState={task.taskState} taskOwner={task.taskOwner} plans={task.plans} taskNotes={notes + notes} taskCreator={task.taskCreator}/> -->
  <!-- Create
  <TaskCreateForm />
  Release
  <TaskReleaseForm/>  
  Edit
  <TaskEditForm/>
  PM Open
  <TaskChangePlanningStatusForm/>
  Dev Pick up 
  <TaskDevPickUpForm /> -->
  View Form 
  <TaskViewForm/>
  Seek Approval / Give Up
  <TaskDevSeekApprovalGiveUpForm />
</body>
  
<style>
  body {
    margin-top: 60px;
  }
</style>