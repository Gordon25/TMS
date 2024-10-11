<script lang='ts'>
  export let taskName:String;
  export let taskId:String;
  export let taskOwner:String;

</script>

<div class="task-card">
  <div class="task-details">
    <p class="task-id">{taskId}</p>
    <p class="task-name">{taskName}</p>
    <p class="task-owner"><strong>Owner:</strong>{taskOwner}</p>
  </div>
</div>

<style>
.task-card {
  width: 250px; /* Adjust width as needed */
  background-color: #a7e7f2; /* Light blue background */
  border: 1px solid #ccc; /* Light border around the card */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /*Optional shadow for depth*/
  display: flex;
  align-items: center;
  height:100px;
  position: relative;
  font-family: Arial, sans-serif;
}

.task-details {
  flex-grow: 1; /* Make the task details grow and fill the card */
}

p {
  font-size: 18px;
  padding-left: 10%; 
  margin: 2%;
}

/* Optional: adding a small bar on the left */
.task-card:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 10px;
  background-color:var(--planColor); /* Darker color for the left bar */
  border-radius: 10px 0 0 10px; /* Rounded corner on the left */
}
</style>