import { redirect } from "@sveltejs/kit";
import axiosInstance from "./axiosConfig";
import loginStatus from "./stores/loginStatus";

const logout = async () => {
  let success = false;
  let message = "";
  try {
    const responseData = await axiosInstance.get(`/logout`).then((res) => res.data);

    success = responseData.success;
    message = responseData.message;
    if (success) {
      loginStatus.update((status) => ({ ...status, isLoggedIn: false, isAdmin: false }));
      console.log("LOGOUT RESPONSE ", responseData, loginStatus);
      window.location.href = "/login";
    } else {
      console.log("LOGOUT MESSAGE ", message);
    }
  } catch (error) {
    console.log("LOGOUT ERROR ", error);
  }
};
export default logout;
