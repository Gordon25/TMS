<script lang='ts'>
  import AppViewCard from "./AppViewCard.svelte";
  import Popup from "$lib/components/Popup.svelte"
  import Select from "svelte-select";
  import { createEventDispatcher } from "svelte";
  import axiosInstance from "$lib/axiosConfig";
  import { invalidateAll } from "$app/navigation";
  export let createGroups: string[];
  export let openGroups: string[];
  export let todoGroups: string[];
  export let doingGroups: string[];
  export let doneGroups: string[];
  export let token:string;
  let appAcronym:string='';
  let startDate:string='';
  let endDate:string='';
  let description:string='';
  let createGroup: string='';
  let openGroup: string='';
  let todoGroup: string='';
  let doingGroup: string='';
  let doneGroup: string='';
  let appResult:{success:boolean, field:string,message:string}|undefined;
  const dispatch = createEventDispatcher();
  function closeModal() {
    dispatch('close');
  }
  const createApp = async ()=> {
    console.log("CREATING APP ", token);
    const createAppResult = await axiosInstance
      .post(
        `/apps`,
        {
          appAcronym,
          startDate,
          endDate,
          description,
          create:createGroup,
          open:openGroup,
          todo:todoGroup,
          doing:doingGroup,
          done:doneGroup,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        let data = res.data;
        const { success, field, message } = data;
        return { success, field, message };
      });
    const {success} = createAppResult;
    if (success) {
      dispatch('createSuccess', createAppResult.message)
      invalidateAll();
      closeModal();
    }
    appResult = createAppResult;
  }

  const timeout = 3000
  $:{
    if (appResult) {
      setTimeout(()=>{
        appResult = undefined;
      }, timeout)
    }
  }
$:console.log("APP RES ", appResult)
</script>

<AppViewCard>
  <input slot='app-acronym' type="text" id="app-acronym" name="app-acronym" bind:value={appAcronym}/>
  {#if appResult && appResult.field==='app acronym'}
    <Popup slot='app-acronym-popup-msg' message={appResult?.message} success={appResult?.success}/>
  {/if}
  <input slot='start-date' type="date" id="start-date" name="start-date" bind:value={startDate}/>
  <Popup slot='start-date-popup-msg' message={appResult?.message} success={appResult?.success}/>
  <input slot='end-date' type="date" id="end-date" name="end-date" bind:value={endDate}/>
  <Popup slot='end-date-popup-msg' message={appResult?.message} success={appResult?.success}/>
  <div slot = 'create' class='dropdown-select'>
    <Select items={createGroups} bind:justValue={createGroup}/>
    <!-- <input type="hidden" id="create" name="create" value="{createGroup}" /> -->
  </div>
  <Popup slot='create-popup-msg' message={appResult?.message} success={appResult?.success}/>
  <div slot='open' class="dropdown-select">
    <Select items={openGroups} bind:justValue={openGroup}/>
    <!-- <input type="hidden" id="open" name="open" value="{openGroup}" /> -->
  </div>
  <Popup slot='open-popup-msg'message={appResult?.message} success={appResult?.success}/>
  <div slot='todo' class="dropdown-select">
    <Select items={todoGroups} bind:justValue={todoGroup}/>
    <!-- <input type="hidden" id="todo" name="todo" value="{todoGroup}" /> -->
  </div>
  <Popup slot='todo-popup-msg' message={appResult?.message} success={appResult?.success}/>
  <div slot='doing' class="dropdown-select">
    <Select items={doingGroups} bind:justValue={doingGroup}/>
    <!-- <input type="hidden" id="doing" name="doing" value="{doingGroup}" /> -->
  </div>
  <Popup slot='doing-popup-msg' message={appResult?.message} success={appResult?.success}/>
  <div slot='done' class="dropdown-select">
    <Select items={doneGroups} bind:justValue={doneGroup}/>
    <!-- <input type="hidden" id="done" name="done" value="{doneGroup}" /> -->
  </div>
  <Popup slot='done-popup-msg' message={appResult?.message} success={appResult?.success}/>
  <textarea slot='description' id="description" bind:value={description}></textarea>
  <div  slot='form-actions' class='form-actions'>
    <div class='save-btn'>
      <button type="submit" class="btn save-btn" on:click|preventDefault={createApp}>Save Changes</button>
    </div>
  <div class='cancel-btn'>
    <button class="btn-cancel-btn" on:click|preventDefault={closeModal}>Cancel</button>
  </div>
  </div>
</AppViewCard>


<style>
input[type="text"],
input[type="date"],
textarea,
/* Target the dropdown select container */
.dropdown-select {
    /* Make the select as wide as the input fields */
    padding: 10px;
    border-radius: 5px;
  }
  
  input[type='text'],
  input[type='date'],
  .dropdown-select {
    width: 70%;
    
  }
  textarea {
    height: 80%;
    width: 90%;
    font-size: 18px;
  }

  button {
    padding: 10px 20px;
    background-color: #4a4a4a;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #333;
  }

  .form-actions {
    grid-column: span 2;
    display: flex;
    justify-content: space-between;
  }

  .save-btn {
    grid-column: 1;
    
    }

    .cancel-btn {
    grid-column: 2;
   
    }
</style>