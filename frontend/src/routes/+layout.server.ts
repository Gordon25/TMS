import type { LayoutServerLoad } from "./$types";
import axiosInstance from "$lib/axiosConfig";
import loginStatus from "$lib/stores/loginStatus";
import axios from "axios";
import { isAccessor } from "typescript";
export const load: LayoutServerLoad = async ({ cookies, request }) => {
  let isLoggedIn = false;
  const token = cookies.get("token");
  let isUserAdmin = false;
  loginStatus.subscribe((status) => console.log(`log in status ${status}`));
  if (token) {
    // Check if tokisLoggedIn = true; // Set to true if token is present
    isLoggedIn = true;
    try {
      const response = await axiosInstance
        .get("checkIsAdmin", {
          headers: {
            Authorization: `Bearer ${token}`,
            "user-agent": request.headers.get("user-agent"),
          },
          withCredentials: true,
        })
        .then((res) => res.data)
        .catch((err) => err.response.data);
      const { isAdmin } = response;

      return { isLoggedIn, isAdmin };
    } catch (error) {
      return { isLoggedIn, isAdmin: isUserAdmin };
    }
  }
  return { isLoggedIn, isAdmin: isUserAdmin };
};
