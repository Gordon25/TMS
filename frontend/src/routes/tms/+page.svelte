<script lang='ts'>
  import loginStatus from "../../lib/stores/loginStatus";

  // export let data:PageServerData;
  import { onMount } from "svelte";
  interface App {
  acronym: String;
  rNumber: String;
  StartDate: String;
  EndDate: String;
  TaskCreate: String;
  TaskOpen: String;
  TaskToDo: string;
  TaskDoing: string;
  TaskDone: string;
  Description: string;
}
  let apps:App[] = [
    {
      acronym: "App1",
      rNumber: "0",
      StartDate: "",
      EndDate: "",
      TaskCreate: "PL",
      TaskOpen: "User",
      TaskToDo: "",
      TaskDoing: "",
      TaskDone: "",
      Description: "This is the first app",
    },
    {
      acronym: "App2",
      rNumber: "0",
      StartDate: "",
      EndDate: "",
      TaskCreate: "PL",
      TaskOpen: "",
      TaskToDo: "",
      TaskDoing: "user",
      TaskDone: "",
      Description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
  ];
 $:{console.log("TASK LIST ", $loginStatus)}

</script>
<body>

  <table>
      <thead>
          <tr>
              <th>Acronym</th>
              <th>Rnumber</th>
              <th>Start</th>
              <th>End</th>
              <th>Task Create</th>
              <th>Task Open</th>
              <th>Task To Do</th>
              <th>Task Doing</th>
              <th>Task Done</th>
              <th>Description</th>
              <th><button>Create App</button></th>
            </tr>
      </thead>
      
      <tbody>
        {#each apps as app}
          <tr>
              <td>{app.acronym}</td>
              <td>{app.rNumber}</td>
              <td>{app.StartDate}</td>
              <td>{app.EndDate}</td>
              <td>{app.TaskCreate}</td>
              <td>{app.TaskOpen}</td>
              <td>{app.TaskDoing}</td>
              <td>{app.TaskDone}</td>
              <td>{app.TaskDone}</td>
              <td>{app.Description}</td>
              <td><button>View App</button></td>
          </tr>
          {/each}
      </tbody>
  </table>

</body>

<style>
body{
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  margin-top: 30px;

  align-items: top;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: fixed; /* Ensures that columns maintain a fixed width */
}

th, td {
  padding: 10px;
  text-align: center;
  
}

td { 
    width: 200px; /* Set a fixed width or adjust as needed */
    overflow: hidden; /* Hide any content that overflows the container */
    white-space: nowrap; /* Prevent text from wrapping to the next line */
    text-overflow: ellipsis; /* Display an ellipsis (...) to indicate clipped text */
    padding: 5px; /* Optional: add padding for spacing */
}
th {
  font-weight: bold;
  background-color:transparent;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody {
  background-color: #f3f3f3;
}
tbody:hover {
  background-color: #f0f0f0;
}

tr {
  border: 1px solid black;
}

button {
  padding: 10px 15px; /* Padding around button text */
    background-color: #007BFF; /* Blue background */
    color: white; /* White text */
    border: none; /* Remove border */
    border-radius: 4px; /* Rounded corners */
    cursor: pointer; /* Pointer cursor on hover */
    font-size: 14px; /* Font size */
    transition: background-color 0.3s ease; /* Smooth transition */
}
</style>
