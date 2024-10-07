import axiosInstance from "./axiosConfig";
import loginStatus from "./stores/loginStatus";
import { goto } from "$app/navigation";
import { redirect } from "@sveltejs/kit";
const logout = async () => {
  let success = true;
  let message = "";
  const responseData = await axiosInstance.get(`/logout`);

  // (({ success, messsage } = responseData));

  if (success) {
    loginStatus.set({ ...loginStatus, isLoggedIn: false, isAdmin: false });
    throw redirect(301, "/login");
  } else {
    return { success, message };
  }
};

export default logout;
