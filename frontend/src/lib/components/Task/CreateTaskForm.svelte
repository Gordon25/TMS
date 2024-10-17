<script lang="ts">
  import axiosInstance from "$lib/axiosConfig";
  import { onMount } from "svelte";
  import Select from "svelte-select"
  export let token:string='';
  let plans:string[]=[];
  let taskState = 'Open';
  let taskCreator: string;
  let taskOwner: string;
  // export let formAction:string;
  let taskname:string;
  let taskPlan:string;
  onMount(async()=>{
    const userResult = await axiosInstance.get("/user",{
      headers:{
        Authorization: `Bearer ${token}`,
      },withCredentials:true
    }).then(res=>res.data)
    .catch(err=>console.log(err.response.data))
    const {username} = userResult.data
    taskCreator = username;
    taskOwner = username;
    console.log(userResult);
  })
</script>

<div class="form-container">
  <form>
    <div class="form-left">
      <div class="input-group">
        <div class='input-label'>
          <label for="task-name">Task name:</label>
        </div>
        <div class='input-value'>
          <slot name="task-name">
           <input type='text' id='task-name' name='task-name' bind:value={taskname}/>
          </slot>
        </div>
      </div>
      <div class='input-group'>
        <div class='input-label'>
          <slot name='task-id-label'></slot>
        </div>
        <div class='input-value'>
          <slot name='task-id-value'></slot>
        </div>
      </div>
      <div class="input-group">
          <div class='input-label'>
            <label for="task-plan">Plan:</label>
          </div>
          <div class='input-value'>
            <slot name="task-plan">
              <div class='dropdown-select'>
                <Select items={plans} bind:value={taskPlan} />
              </div>
            </slot>
          </div>
      </div>
      <div class="input-group">
        <div class='input-label'>
          <label for='label'>State:</label>
        </div>
        <div class='input-value'>
          <p>{taskState}</p>
        </div>
      </div>
      <div class="input-group">
        <div class='input-label'>
          <label for='creator'>Creator:</label>
        </div>
        <div class='input-value'>
          <p>{taskCreator}</p>
        </div>
      </div>
      <div class="input-group">
        <div class='input-label'>
          <label for='owner'>Owner:</label>
        </div>
        <div class='input-value'>
          <p>{taskOwner}</p>
        </div>
      </div>
      {#if taskState != 'Open'}
      <div class='input-group'>
        <div class='input-label'>
          <slot name='task-create-date-label'></slot>
        </div>
        <div class='input-value'>
          <slot name='task-create-date-value'></slot>
        </div>
      </div>
      {/if}
      <div class="input-description">
        <div class='input-label'>
          <label for="description">Description:</label>
        </div>
        <slot name="task-description">
          <textarea id="description" maxlength="255"></textarea>
        </slot>
      </div>
    </div>
    <div class="vl"></div>
    <div class="form-right">
      <slot name='notes'>
      <div class='add-notes'>
        <label for='notes'>Add Notes:</label>
      </div>
      <div class="input-text">
      <textarea id='notes'></textarea>
      </div>
      </slot>
    </div>
  </form>
    <div class="form-actions">
        <div class='first-btn-container'>
        <slot name='first-btn'></slot>
      </div>
      <div class='second-btn-container'>
        <slot name='second-btn'></slot>
      </div>
      <div class='third-btn-container'>
        <slot name='third-btn'>
          <button class='third-btn'>Save Changes</button>
        </slot>
      </div>
      <div class='fourth-btn-container'>
        <slot name='fourth-btn'>
          <button class='fourth-btn'>Cancel</button>
        </slot>
      </div>
    </div>
</div>

<style>

.form-container {
    width: 95%;
    margin: 0 auto;
    padding: 20px;
    background-color: #f4f4f4;
    /* border: 1px solid #ddd; */
    border-radius: 10px;
    height: 70vh;
  }

  form {
    display: grid;
    grid-template-columns: 0.40fr 0.01fr 0.75fr;
    gap: 0;
    height: 95%;
  }

  .form-left {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  label {
    margin-bottom: 5px;
    font-weight: bold;
  }

  .input-group {
    margin-bottom: 20px;
    display: grid;
    align-items: center;
    flex-direction: row;
    gap: 10px;
    width: 100%;
    justify-content: flex-end;
    grid-template-columns: 0.30fr 0.80fr;
  }

  .input-label {
    align-content: right;
    white-space: nowrap;
  }

  .input-text {
    height: 95%;
    display: flex;
    flex-direction: column;
    width: 95%;
    align-items: baseline;
    margin-left: 0;
    margin-bottom: 0;
  }

input[type="text"],
textarea,
/* Target the dropdown select container */
.dropdown-select {
    /* Make the select as wide as the input fields */
    padding: 10px;
    border-radius: 5px;
  }
  .dropdown-select{
    padding-left: 0;
  }
  input[type='text'] {
    width: 70%;
  }

  .dropdown-select {
    width: 75%;
  }
  textarea {
    height: 100%;
    width: 100%;
    font-size: 18px;
    resize: none;
  }

  .input-description {
    height: 30%;
  }
  .input-description .input-label {
    margin-bottom: 10px;
  }
  .input-description textarea {
    width: 90%;
    height: 100%;
  }

  .form-actions {
    grid-column: span 2;
    display: flex;
    justify-content: space-between;
    min-height: 6%;
    width: 97%;
  }

  .form-actions {
    grid-column: span 4;
    display: flex;
    justify-content: space-between;
    grid-column-gap: 10px;
  }

  .form-actions :global(button) {
    padding: 10px 20px;
    background-color: #4a4a4a;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width:100%;
    height:100%;
  }

  .form-actions :global(button:hover) {
    background-color: #333;
  }

  .form-actions :global(button:disabled) {
    background-color: #999;
  }
  
  .first-btn-container {
    grid-column: 1;
  }

  .second-btn-container {
    grid-column: 2;
  }
  
  .third-btn-container {
    grid-column: 3;
  }

  .fourth-btn-container {
    grid-column: 4;
  }

  .third-btn {
    background-color: rgb(26, 202, 50);
  }

  .third-btn:hover {
    background-color: rgb(8, 163, 29); 
  }

  .fourth-btn {
    background-color: rgb(240, 69, 57);
  }

  .fourth-btn:hover {
    background-color: rgb(243, 98, 41);
  }

  .first-btn-container, .second-btn-container, .third-btn-container, .fourth-btn-container {
    width: 20%;
  }

  .vl {
  border-left: 0.05rem solid black;
  height: auto;
  position: relative;
  left: 0%;
  margin-left: -3px;
  top: 0;
  }
</style>
