import axiosInstance from "./axiosConfig";
import loginStatus from "./stores/loginStatus";

const logout = async () => {
  let success = false;
  let message = "";
  try {
    const responseData = await axiosInstance
      .get(`/logout`)
      .then((res) => res.data)
      .catch((err) => err.response.data);

    success = responseData.success;
    message = responseData.message;
    if (success) {
      loginStatus.update((status) => ({ ...status, isLoggedIn: false, isAdmin: false }));
      console.log("LOGOUT RESPONSE ", responseData);
      window.location.href = "/login";
    } else {
      return alert(message);
    }
  } catch (error) {
    console.log(error);
  }
};
export default logout;
