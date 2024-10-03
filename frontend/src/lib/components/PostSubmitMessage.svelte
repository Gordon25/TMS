<script>
 export let form;
 $:console.log("Form ", form)
</script>
{#if form}
<p class={form.success ? 'success-msg' : 'failure-msg'}>
  {form.message}
</p>
{/if}
<style>
.success-msg {
    color: green;
    font-weight: bold;
  }
  .failure-msg {
    color: red;
    font-weight: bolder;
  }
</style>