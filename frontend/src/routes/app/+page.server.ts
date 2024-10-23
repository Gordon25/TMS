import axiosInstance from "$lib/axiosConfig";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
export const load: PageServerLoad = async ({ request, cookies }) => {
  const token = cookies.get("token");
  const checkIsPMResult = await axiosInstance
    .get("/checkIsPM", {
      headers: {
        "user-agent": request.headers.get("user-agent"),
        Cookie: `token=${token}`,
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
    .catch((error) => {
      if (error.status === 401) {
        throw redirect(303, "/login");
      } else {
        console.log(error.status);
      }
    });

  return { token, isUserPM: checkIsPMResult };
};
