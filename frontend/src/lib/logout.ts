import axiosInstance from "./axiosConfig";
import loginStatus from "./stores/loginStatus";
import { redirect } from "@sveltejs/kit";
const logout = async () => {
  try {
    let success: boolean = true;
    let message = "";
    const responseData = await axiosInstance
      .get(`/logout`)
      .then((res) => res.data)
      .catch((err) => err.response.data);
    success = responseData.success;
    message = responseData.message;
    if (success) {
      loginStatus.update((status) => ({ ...status, isLoggedIn: false, isAdmin: false }));
      return { success, message: "successfully logged out" };
    } else {
      return { success, message };
    }
  } catch (error) {
    return { success: false, message: "Error logging out" };
  }
};
export default logout;
