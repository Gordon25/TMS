import { redirect, type Actions } from "@sveltejs/kit";
import type { AxiosError, AxiosResponse } from "axios";
import type { PageServerLoad } from "./$types";
import { navigating, page } from "$app/stores";
import { PUBLIC_BACKEND_HOSTNAME } from "$env/static/public";
import axios from "axios";
import { afterNavigate } from "$app/navigation";
import loginStatus from "$lib/stores/loginStatus";
export const actions: Actions = {
  login: async ({ request }) => {
    // get form inputs
    const form: FormData = await request.formData();
    console.log(form.get("username"));
    console.log(form.get("password"));
    // send to backend
    const response = await axios
      .post(
        `${PUBLIC_BACKEND_HOSTNAME}/login`,
        {
          username: form.get("username"),
          password: form.get("password"),
        },
        {
          withCredentials: true,
        }
      )
      .then((res: AxiosResponse) => res);
    console.log("RESPONSE ", response.headers);
    const { success } = response.data;
    if (success) {
      console.log("SUCCESS", response.headers.cookies, "COOKIES IS SET");
      const { isAdmin } = response.data;
      loginStatus.set({ isLoggedIn: true, isAdmin: isAdmin });
      redirect(301, "./tms");
    } else {
      const { message } = response.data;
      redirect(301, "/");
    }
  },
};

export const load: PageServerLoad = async ({ cookies, request }) => {
  const token = cookies.get("token");
  console.log(page.subscribe);
  if (token) {
    // user already logged in
    console.log("NAVIGATING ", navigating);

    const referer = request.headers.get("referer");
  }
};
