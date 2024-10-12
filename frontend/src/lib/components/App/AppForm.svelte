<script lang="ts">
  import Select from "svelte-select";
  export let createGroups: string[];
  export let openGroups: string[];
  export let todoGroups: string[];
  export let doingGroups: string[];
  export let doneGroups: string[];
  // export let formAction:string;

  let createGroup: string;
  let openGroup: string;
  let todoGroup: string;
  let doingGroup: string;
  let doneGroup: string;

</script>

<div class="form-container">
  <form>
    <div class="form-left">
      <div class="input-group">
        <label for="app-acronym">App Acronym:</label>
        <input type="text" id="app-acronym" name="app-acronym" />
      </div>
      <div class="input-group">
        <label for="start-date">Start Date:</label>
        <input type="date" id="start-date" name="stat-date" />
      </div>
      <div class="input-group">
        <label for="end-date">End Date:</label>
        <input type="date" id="end-date" name="end-date" />
      </div>
      <div class="task-permissions">
        <p><strong>Task Permissions</strong></p>
      </div>
        <div class="input-group">
          <label for="create">Create:</label>
          <div class='dropdown-select'>
            <Select items="{createGroups}" bind:value="{createGroup}" />
            <input type="hidden" id="create" name="create" value="{createGroup}" />
          </div>
        </div>
        <div class="input-group">
          <label for="open">Open:</label>
          <div class="dropdown-select">
          <Select class="dropdown-select" items="{openGroups}" bind:value="{openGroup}" />
          <input type="hidden" id="open" name="open" value="{openGroup}" />
          </div>
        </div>
        <div class="input-group">
          <label for="todo">ToDo:</label>
          <div class="dropdown-select">
          <Select class="dropdown-select" items="{todoGroups}" bind:value="{todoGroup}" />
          <input type="hidden" id="todo" name="todo" value="{todoGroup}" />
          </div>
        </div>
        <div class="input-group">
          <label for="doing">Doing:</label>
          <div class="dropdown-select">
          <Select class="dropdown-select" items="{doingGroups}" bind:value="{doingGroup}" />
          <input type="hidden" id="doing" name="doing" value="{doingGroup}" />
          </div>
        </div>
        <div class="input-group">
          <label for="done">Done:</label>
          <div class="dropdown-select">
          <Select class="dropdown-select" items="{doneGroups}" bind:value="{doneGroup}" />
          <input type="hidden" id="done" name="done" value="{doneGroup}" />
          </div>
        </div>
      
    </div>
    <div class="form-right">
      <div class="input-text">
        <label for="description">Description:</label>
        <textarea id="description"></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn save-btn">Save Changes</button>
        <button class="btn cancel-btn">Cancel</button>
      </div>
    </div>
  </form>
</div>

<style>
  .form-container {
    width: 60%;
    margin: 20px auto;
    padding: 20px;
    background-color: #f4f4f4;
    border: 1px solid #ddd;
    border-radius: 10px;
  }

  form {
    display: grid;
    grid-template-columns: 0.5fr 0.75fr;
    gap: 20px;
  }

  .form-left {
    display: flex;
    flex-direction: column;
    
   
  }
  label {
    margin-bottom: 5px;
    font-weight: bold;
  }

  .input-group {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 20px;
    width: 100%;
    justify-content: flex-end;
    margin-left: 0;
  }
  .input-text {
    height: 80%;
    margin-bottom: 10px;
    display: flex;

    flex-direction: column;
    gap: 20px;
    width: 100%;
    justify-content: flex-end;
    margin-left: 0;
  }
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
  }

  .form-actions {
    grid-column: span 2;
    display: flex;
    justify-content: space-between;
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

  button[type="button"] {
    background-color: #bbb;
  }

  button[type="button"]:hover {
    background-color: #999;
  }
</style>
