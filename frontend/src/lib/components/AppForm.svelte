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

        <div class="input-group">
          <label for="create">Create:</label>
          <Select class='select' items="{createGroups}" bind:value="{createGroup}" />
          <input type="hidden" id="create" name="create" value="{createGroup}" />
        </div>
        <div class="input-group">
          <label for="open">Open:</label>
          <Select class="select" items="{openGroups}" bind:value="{openGroup}" />
          <input type="hidden" id="open" name="open" value="{openGroup}" />
        </div>
        <div class="input-group">
          <label for="todo">ToDo:</label>
          <Select class="select" items="{todoGroups}" bind:value="{todoGroup}" />
          <input type="hidden" id="todo" name="todo" value="{todoGroup}" />
        </div>
        <div class="input-group">
          <label for="doing">Doing:</label>
          <Select items="{doingGroups}" bind:value="{doingGroup}" />
          <input type="hidden" id="doing" name="doing" value="{doingGroup}" />
        </div>
        <div class="input-group">
          <label for="done">Done:</label>
          <Select class="select" items="{doneGroups}" bind:value="{doneGroup}" />
          <input type="hidden" id="done" name="done" value="{doneGroup}" />
        </div>
      </div>
    </div>
    <div class="form-right">
      <div class="input-group">
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
  * {
    box-sizing: border-box;
  }

  .form-container {
    width: 80%;
    margin: 20px auto;
    padding: 20px;
    background-color: #f4f4f4;
    border: 1px solid #ddd;
    border-radius: 10px;
  }

  form {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-gap: 20px;
  }

  .form-left label {
    font-weight: bold;
    margin-top: 10px;
  }

  .form-left .input-group {
    display: flex;
    flex-direction: row;
  }
  .form-left input,
  .form-left .select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    background-color: #f9f4e8;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  textarea {
    width: 100%;
    height: 150px;
    padding: 8px;
    background-color: #f9f4e8;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .form-right textarea {
    margin-top: 10px;
  }

  .form-actions {
    grid-column: span 2;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
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
