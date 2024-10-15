<script lang='ts'>
export let appAcronym:string='';
export let startDate:string='';
export let endDate:string='';
export let createGroup:string='';
export let openGroup:string='';
export let todoGroup:string='';
export let doingGroup:string='';
export let doneGroup:string='';
export let description:string='';
let appResult:{success:boolean, field:string, message:string}={success:true, field:'',message:''};

</script>

<div class="form-container">
  <form method="post" on:submit|preventDefault>
    <div class="form-left">
      <div class="input-group">
        <label for="app-acronym">App Acronym:</label>
        <slot name="app-acronym">
          <p>{appAcronym}</p>
        </slot>
      </div>
      {#if appResult && appResult.field==='app acronym'}
      <slot name="app-acronym-popup-msg"></slot>
      {/if}
      <div class="input-group">
        <label for="start-date">Start Date:</label>
        <slot name="start-date">
          <input type="date" disabled value={startDate} />
        </slot>
      </div>
      {#if appResult && appResult.field ==='start date'}
        <slot name="start-date-popup-msg"></slot>
      {/if}
      <div class="input-group">
        <label for="end-date">End Date:</label>
        <slot name="end-date">
          <input type="date" disabled value={endDate} />
        </slot>
      </div>
      {#if appResult && appResult.field ==='end date'}
        <slot name="end-date-popup-msg"></slot>
      {/if}
      <div class="task-permissions">
        <p><strong>Task Permissions</strong></p>
      </div>

      <div class="input-group">
        <label for="create">Create:</label>
        <slot name="create">
          <p>{createGroup}</p>
        </slot>
      </div>
      {#if appResult && appResult.field === 'create'}
        <slot name="create-popup-msg"></slot>
      {/if}

      <div class="input-group">
        <label for="open">Open:</label>
        <slot name="open">
          <p>{openGroup}</p>
        </slot>
      </div>
      {#if appResult && appResult.field === 'open'}
        <slot name="open-popup-msg"></slot>
      {/if}

      <div class="input-group">
        <label for="todo">ToDo:</label>
        <slot name="todo">
          <p>{todoGroup}</p>
        </slot>
      </div>
      {#if appResult && appResult.field === 'todo'}
        <slot name="todo-popup-msg"></slot>
      {/if}

      <div class="input-group">
        <label for="doing">Doing:</label>
        <slot name="doing">
          <p>{doingGroup}</p>
        </slot>
      </div>
      {#if appResult && appResult.field === 'doing'}
        <slot name="doing-popup-msg"></slot>
      {/if}

      <div class="input-group">
        <label for="done">Done:</label>
        <slot name="done">
          <p>{doneGroup}</p>
        </slot>
      </div>
      {#if appResult && appResult.field === 'done'}
        <slot name="done-popup-msg"></slot>
      {/if}
    </div>

    <div class="form-right">
      <div class="input-text">
        <label for="description">Description:</label>
        <slot name='description'>
        <textarea disabled>{description}</textarea>
      </slot>
      </div>

      <slot name="form-actions"></slot>
      
    </div>
  </form>
</div>

  <style>
    .form-container {
      width: 90%;
      height: 60%;
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
  p,:global(input[type="text"]),
  :global(input[type="date"]),
  :global(textarea),
  /* Target the dropdown select container */
  :global(.dropdown-select) {
      /* Make the select as wide as the input fields */
      padding: 10px;
      border-radius: 5px;
    }
    
    p,:global(input[type='text']),
    :global(input[type='date']),
    :global(.dropdown-select) {
      width: 70%;  
    }

    :global(textarea) {
      height: 80%;
      width: 90%;
      font-size: 18px;
    }
    p {
      font-size: 18px;
    }
  
    :global(button) {
      padding: 10px 20px;
      background-color: #4a4a4a;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  
    :global(button:hover) {
      background-color: #333;
    }
  
    :global(button[type="button"]) {
      background-color: #bbb;
    }
  
    :global(button[type="button"]:hover) {
      background-color: #999;
    }
  </style>
  