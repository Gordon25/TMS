<script lang="ts">
  export let taskState: string;
  export let taskCreator: string;
  export let taskOwner: string;
  export let taskNotes: string;
  // export let formAction:string;
</script>

<div class="form-container">
  <form>
    <div class="form-left">
      <div class="input-group">
        <div class='input-label'>
          <label for="task-name">Task name:</label>
        </div>
        <div class='input-value'>
          <slot name="task-name"></slot>
        </div>
      </div>
      <div class='input-group'>
        <div class='input-label'>
          <slot name='task-id-label'>
          <label for='taskId'>Task ID:</label>
          </slot>
        </div>
        <div class='input-value'>
          <slot name='task-id-value'>
          </slot>
        </div>
      </div>
      <div class="input-group">
          <div class='input-label'>
            <label for="taskPlan">Plan:</label>
          </div>
          <div class='input-value'>
            <slot name="task-plan">
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
      <div class='input-group'>
        <div class='input-label'>
          <slot name='task-create-date-label'></slot>
        </div>
        <div class='input-value'>
          <slot name='task-create-date-value'></slot>
        </div>
      </div>
      <div class="input-description">
        <div class='input-label'>
          <label for="description">Description:</label>
        </div>
        <slot name="task-description"></slot>
      </div>
    </div>
    <div class="vl"></div>
    <div class="form-right">
      <div class='existing-notes'>
        <label for='notes'>Notes:</label>
      <slot name='existing-notes'>
        <div class='task-notes'>{taskNotes}</div>
      </slot>
      </div>
      <div class="input-text">
      <slot name='add-note-label'></slot>
      <slot name='add-note-input'></slot>
      </div>
      
    </div>
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
  </form>
</div>

<style>
  .form-container {
    width: 70%;
    margin: 20px auto;
    padding: 20px;
    background-color: #f4f4f4;
    border: 1px solid #ddd;
    border-radius: 10px;
    /* height:60vh; */
    align-items: stretch; 
  }

  form {
    display: grid;
    grid-template-columns: 0.60fr 0.01fr 0.75fr;
    gap: 20px;
    height: 100%;
    font-size: 18px;
  }

  .form-left {
    display: flex;
    flex-direction: column;
  }
  
  :global(label) {
    margin-bottom: 5px;
    font-weight: bold;
  }

  .input-group, .input-description {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 20px;
    margin-left: 0;
  }

  .input-group :global() {
    width: 80%;
    align-items: center;
    display: grid;
    grid-template-columns: 0.50fr 0.75fr;
    height:10%;
  }

  .input-description {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    width: 100%;
    height: 100%;
    gap:0;
  }

  .input-description {
    align-content: top;
    width: 100%;
  }

  .input-group :global(.input-label) {
    width: 40%;
    align-content: right;
    white-space: nowrap;
  }

  .input-group :global(.input-value) {
    width: 50%
  }
  .input-text {
    height: 45%;
    margin-bottom: 0.05%;
    display: flex;
    margin-top: 0;
    flex-direction: column;
    gap: 10px;
    width: 95%;
    justify-content: top;
    margin-left: 0;
    align-items: top;
    position:relative;
    top:2%;
  }


.form-left :global(input[type="text"]),
:global(textarea),
/* Target the dropdown select container */
.dropdown-select :global() {
    /* Make the select as wide as the input fields */
    border-radius: 5px;
    width: 100%;
  }

  :global(input[type="text"]),
  :global(textarea) {
    font-size: 18px;;
  }


  .input-description {
    gap:10px;
  }
  .input-description :global(textarea) {
    height: 80%;
    width: 90%;
  }

  .input-text :global(textarea) {
    height: 90%;
    width:100%;
  }

  .form-right {
    display: flex;
    flex-direction: column;
    gap:5px;
  }

  .existing-notes {
    height: 45%;
    margin-bottom: 0;
    display: flex;
    margin-top: 0;
    flex-direction: column;
    gap: 5px;
    width: 99%;
    justify-content: top;
    margin-left: 0;
    align-items: top;
    position:relative;
    top:2%;
  }
  
  .existing-notes .task-notes {
    height: 100%;
    width: 100%;
    background-color: white;
    max-height: 80%;
    overflow-y: scroll;
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
  height: 500px;
  position: relative;
  left: 0%;
  margin-left: -3px;
  top: 0;
  }
</style>
