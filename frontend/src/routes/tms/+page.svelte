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
      Description: "",
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
              <th>Start Date</th>
              <th>End Date</th>
              <th>Task Create</th>
              <th>Task Open</th>
              <th>Task To Do</th>
              <th>Task Doing</th>
              <th>Task Done</th>
              <th>Description</th>
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
  background-color: #f5f5f5;
  align-items: top;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

table, th, td {
  border: 1px solid black;
}
</style>
