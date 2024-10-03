import { writable } from "svelte/store";
const loginStatus = writable({
  isLoggedIn: false,
  isAdmin: false,
});
export default loginStatus;
