<script lang='ts'>
  import Popup from "$lib/components/Popup.svelte";
  import Form from "../../lib/components/form.svelte"
  let isSubmitted = false
  let inputFields:InputField[] = [
    {
      name:"username",
      type:"string",
      value:""
    },
    {
      name:"password",
      type:"string",
      value:""
    },
    {
      name:"log in",
      type:"submit",
    }
  ]
  let submitFunc = (event:Event)=>{
     
        event.preventDefault()
        isSubmitted = true;

        setTimeout(()=>{isSubmitted = false}, 1000)}
  $:console.log("IS SUBMITTED ", isSubmitted)
</script>

<Form {inputFields} {submitFunc} />
<div>
{#if isSubmitted}
<Popup message="Success!"/>
{/if}
</div>