import type { LayoutServerLoad } from "./$types";
import axiosInstance from "$lib/axiosConfig";
export const load: LayoutServerLoad = async ({ cookies, request }) => {
  let isLoggedIn = false;
  const token = cookies.get("token");
  let isUserAdmin = false;
  if (token) {
    isLoggedIn = true;
    const response = await axiosInstance
      .get("/checkIsAdmin", {
        headers: {
          Cookie: `token=${token}`,
          "user-agent": request.headers.get("user-agent"),
        },
        withCredentials: true,
      })
      .then((res) => {
        let data = res.data;
        isUserAdmin = data.isInGroup;
      })
      .catch((err) => {
        // console.log("CHECK IS ADMIN ERROR ", err.response.data);
        // return err.response.data;
      });
  }
  return { isLoggedIn, isAdmin: isUserAdmin };
};
