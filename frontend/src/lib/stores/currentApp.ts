import { writable } from "svelte/store";
const currentApp = writable("");
// {
// app_acronym: "",
// app_rnumber: "",
// app_startdate: "",
// app_enddate: "",
// app_permit_create: "",
// app_permit_open: "",
// app_permit_todolist: "",
// app_permit_doing: "",
// app_permit_done: "",
// app_description: "",
// });
export default currentApp;
