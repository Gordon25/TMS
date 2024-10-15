import type { LayoutServerLoad } from "./$types";
import axiosInstance from "$lib/axiosConfig";
import handleError from "$lib/errorHandler";
export const load: LayoutServerLoad = async ({ cookies, request }) => {
  let isLoggedIn = false;
  const token = cookies.get("token");
  let isUserAdmin = false;
  if (token) {
    isLoggedIn = true;
    const response = await axiosInstance
      .get("checkIsAdmin", {
        headers: {
          Authorization: `Bearer ${token}`,
          "user-agent": request.headers.get("user-agent"),
        },
        withCredentials: true,
      })
      .then((res) => {
        let data = res.data;
        isUserAdmin = data.isInGroup;
      });
  }
  return { isLoggedIn, isAdmin: isUserAdmin };
};
