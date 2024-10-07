<script lang='ts'>
  export let inputFields:InputField[]
  export let submitFunc:(event:Event)=>void;
</script>
<div class="container">
<form class="form" on:submit|preventDefault={submitFunc}>
{#each inputFields as inputField}
{#if inputField.type=="string"}
<label for={inputField.name}>{inputField.name}</label>
<input name={inputField.name} id={inputField.name} type="string" placeholder={inputField.name} bind:value={inputField.value}/>
{/if}
{#if inputField.type == "submit"}
<button name={inputField.name} id={inputField.name} type="submit" />
{/if}

{/each}

</form>
</div>
<style>
  body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
}
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 300;
}

.form {
    background-color: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    width: 300px;
    text-align: center;
}

.form label {
    display: block;
    margin-bottom: 8px;
    font-size: 15px;
    color: #333;
    text-align: left;
}

.form input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    justify-self: left;
}

.form button {
  padding: 10px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.error {
  display: flex;
    margin-top:20px;
    margin-bottom: 8px;
    color: #920;
}
</style>