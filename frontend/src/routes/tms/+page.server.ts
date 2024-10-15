import { redirect } from "@sveltejs/kit";
import axiosInstance from "../../lib/axiosConfig";
import type { PageServerLoad } from "./$types";
import { success } from "$lib/components/Popup.svelte";

export const load: PageServerLoad = async ({ cookies, request }) => {
  let token = cookies.get("token");
  if (!token) {
    throw redirect(300, "/login");
  }
  const checkIsPLResult = await axiosInstance
    .get("/checkIsPL", {
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
    });
  const appsResult = await axiosInstance
    .get(`/apps`, {
      headers: {
        "user-agent": request.headers.get("user-agent"),
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);

  const groupsResult = await axiosInstance
    .get(`/groups`, {
      headers: {
        "user-agent": request.headers.get("user-agent"),
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);

  const data = {
    apps: appsResult?.data || [],
    groups: groupsResult?.data || [],
    token,
    isUserPL: checkIsPLResult,
  };
  return data;
};
