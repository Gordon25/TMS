import axiosInstance from "$lib/axiosConfig";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ request, cookies }) => {
  const token = cookies.get("token");
  const checkIsPMResult = await axiosInstance
    .get("/checkIsPM", {
      headers: {
        "user-agent": request.headers.get("user-agent"),
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      let data = res.data;
      const { success } = data;
      if (success) {
        return data.isInGroup;
      } else {
        return false;
      }
    })
    .catch((err) => console.log("ERROR ", err.response.data));

  return { token, isUserPM: checkIsPMResult };
};
