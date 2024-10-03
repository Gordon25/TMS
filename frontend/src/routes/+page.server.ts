// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = false;
import type { Actions } from "@sveltejs/kit";
import axios from "axios";
import { PUBLIC_BACKEND_HOSTNAME } from "$env/static/public";
import { redirect } from "@sveltejs/kit";
export const actions: Actions = {
  logout: async ({ cookies, request }) => {
    const token = cookies.get("token");
    const response = await axios.get(`${PUBLIC_BACKEND_HOSTNAME}/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "user-agent": request.headers.get("user-agent"),
      },
      withCredentials: true,
    });
    const { success } = response.data;
    if (success) {
      throw redirect(301, "/login");
    }
  },
};
