<script lang='ts'>
  import { onMount } from "svelte";
  import Popup from "../Popup.svelte";
  import axiosInstance from "$lib/axiosConfig.ts";
  export let token;
  export let appAcronym;
  let planResult:{success:boolean, field:string, message:string, planName?:string,startDate?:string, endDate?:string, planColour?:string, appAcronym?:string}|undefined;
  let planName=''
  let startDate=''
  let endDate=''
  let planColour='#000000';
  let isUserPM:boolean;
  let plans:Plan[]=[];
  const getPlans = async()=>{
    const plansData  = await axiosInstance.post('/appPlans', 
    {
      appAcronym
    },
    {
    withCredentials:true 
    }).then(res=>res.data)
    plans = plansData.data;
  }

  const createPlan = async()=>{
    await axiosInstance
    .post("/plans",{
          planName,
          appAcronym,
          startDate,
          endDate,
          planColour
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        planResult = res.data;
      });
      if (planResult && planResult.success === true) {
        await getPlans();  
      }
      planName = planResult?.planName||''
      startDate = planResult?.startDate||''
      endDate = planResult?.endDate||''
      planColour= planResult?.planColour||'#ffffff'
    };

  const timeout = 3000
  $: {
    if (planResult) {
      setTimeout(()=>{
        planResult = undefined
      }, timeout)
    }
  }

onMount(async()=>{
  await axiosInstance
    .get("/checkIsPM", {
      withCredentials:true
    })
    .then((res) => {
      let data = res.data;
      const { success } = data;
      if (success) {
        isUserPM = data.isInGroup;
      } else {
        isUserPM = false;
      }
    });
  await getPlans();
})

</script>

<body>
  {#if planResult}
    <Popup message={planResult.message} success={planResult.success}/>
  {/if}
  <form on:submit|preventDefault={createPlan}>
  <table>
      <thead>
          <tr>
              <th>plan name:</th>
              <th>start date:</th>
              <th>end date:</th>
              <th>plan color:</th>
              <th></th>
          </tr>
      </thead>
      
      <tbody>
        {#if isUserPM}
        <tr>
          <td><input type='text' bind:value={planName}/></td>
          <td><input type='date' bind:value={startDate}/></td>
          <td><input type='date' bind:value={endDate}/></td>
          <td><input type='color' bind:value={planColour}/></td>
          <td>
            <button type='submit'>Create</button>
          </td>
        </tr>
        {/if}
        {#each plans as plan}
          <tr>
              <td>{plan.plan_mvp_name}</td>
              <td><input type='date' value={plan.plan_startdate} disabled /></td>
              <td><input type='date' value={plan.plan_enddate} disabled /></td>
              <td><input type='color' value={plan.plan_colour} disabled/></td>
              <td></td>
          </tr>
        {/each}
      </tbody>
  </table>
  </form>
</body>

<style>
body{
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 10px;
  margin-top: 0px;

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