import { redirect } from "@sveltejs/kit";
import { AxiosError } from "axios";
import axiosInstance from "./axiosConfig";
import loginStatus from "./stores/loginStatus";

const handleError = async (error: AxiosError) => {
  if (error.status === 403 && error.config?.url != "/tms") {
    throw redirect(300, "/tms");
  } else {
    const responseData = await axiosInstance.get(`/logout`).then((res) => res.data);
    console.log("DELETED COOKIE ", error.config?.url);
    let success = responseData.success;
    let message = responseData.message;
    if (success) {
      loginStatus.update((status) => ({ ...status, isLoggedIn: false, isAdmin: false }));
    }
  }
};

export default handleError;
