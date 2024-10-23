import { redirect } from "@sveltejs/kit";
import axiosInstance from "../../lib/axiosConfig.ts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, request }) => {
  let token = cookies.get("token");
  if (!token) {
    throw redirect(300, "/login");
  }
  const checkIsPLResult = await axiosInstance
    .get("/checkIsPL", {
      headers: {
        "user-agent": request.headers.get("user-agent"),
        Cookie: `token=${token}`,
      },
      withCredentials: true,
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
  const appsResult = await axiosInstance
    .get(`/apps`, {
      headers: {
        "user-agent": request.headers.get("user-agent"),
        Cookie: `token=${token}`,
      },
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((error) => {
      if (error.status === 401) {
        throw redirect(303, "/login");
      } else {
        console.log(error.status);
      }
    });

  const groupsResult = await axiosInstance
    .get(`/groups`, {
      headers: {
        "user-agent": request.headers.get("user-agent"),
        Cookie: `token=${token}`,
      },
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((error) => {
      if (error.status === 401) {
        throw redirect(303, "/login");
      } else {
        console.log(error.status);
      }
    });

  const data = {
    apps: appsResult?.data || [],
    groups: groupsResult?.data || [],
    token,
    isUserPL: checkIsPLResult,
  };
  return data;
};
