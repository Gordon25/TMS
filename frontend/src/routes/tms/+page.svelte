<script lang='ts'>
  import type { PageServerData } from "./$types";
  export let data:PageServerData
  let username, email, password, pageError, success;
  import { onMount } from "svelte";
  onMount(()=>{
    success = data?.success
    if (success) {
    username = data?.username;
    email = data.email;
    } else {
    pageError = data?.message;
    }})
</script>
<div>TMS {data }</div>