<script lang='ts'>
import AppViewCard from "$lib/components/App/AppViewCard.svelte"
import Test from "$lib/components/App/Test.svelte"
import Modal from "$lib/components/Modal.svelte";
import AppForm from "$lib/components/App/AppForm.svelte"
  import axiosInstance from "$lib/axiosConfig";
  import type { PageServerData } from "./$types";
  import { onMount } from "svelte";
export let data:PageServerData;

  let groups= ['PL','Admin','PM','Dev'];

let notes = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
let task = {
  appAcronym:"App1",
  plans:["PL1"],
  taskState:"Created",
  taskCreator:"PL1",
  taskOwner: "PL1",
  taskNotes:""};
  let showModal = false
  let result;
  const closeModal = ()=> {
    (showModal = false)
  }
  const openModal = ()=> {
    (showModal = true)
  }
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBsIiwiaXAiOiI6OjEiLCJicm93c2VyVHlwZSI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMjkuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImlhdCI6MTcyODk3OTIxNywiZXhwIjoxNzI5MDY1NjE3fQ.jZ3krWEWs7ieD2XV5MVTPeSV7asjnYTIfjj_TxNjGTg'
  const getApp = async()=>{
    console.log(data.token)
    const appResult = await axiosInstance
    .post("/app",{appAcronym:localStorage.getItem('app')}, {
      headers: {
        // "user-agent": request.headers.get("user-agent"),
        Authorization: `Bearer ${data.token}`,
      },
    })
    .then((res) => res.data.data[0]);
    console.log(appResult)
    result = appResult;
  }
onMount(async()=>{console.log("GET APPS"); await getApp();} );
</script>

<body>
  <button on:click={getApp}>Get App</button>
  <p>{result?.app_acronym}</p>
  <p>{result?.app_description}</p>
  <p>{result?.app_enddate}</p>
  
  <!-- <button on:click={openModal}> show modal </button> -->
  <!-- {#if showModal} -->
  <!-- <Modal {closeModal} bind:showModal> -->
 <!-- <AppForm on:close={closeModal} createGroups={groups} openGroups={groups} todoGroups={groups} doingGroups={groups} doneGroups={groups}/> -->
    <!-- <AppViewCard/> -->
    <!-- <AppForm/> -->
    <!-- <Test/> -->

</body>

<style>
  body {
    margin-top: 60px;
  }
</style>