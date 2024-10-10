<script>
import logout from "$lib/logout";
import AppCard from "$lib/components/AppCard.svelte";
import AppForm from "$lib/components/AppForm.svelte";
  let groups= ['PL','Admin','PM','Dev'];
</script>

<body>
  <!-- <AppCard appAcronym='App1' startDate='2024/09/03' endDate='2024/09/10'/> -->
  <AppForm createGroups={groups} openGroups={groups} todoGroups={groups} doingGroups={groups} doneGroups={groups}/>
</body>
  
<style>
  body {
    margin-top: 60px;
  }
</style>