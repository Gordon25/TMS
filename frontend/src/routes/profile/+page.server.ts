import type { PageServerLoad } from "./$types";
import type { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "$lib/axiosConfig";

import type { Actions } from "@sveltejs/kit";
export const load: PageServerLoad = async ({ request, cookies }) => {
  const token = cookies.get("token");
  const response = await axiosInstance
    .get(`/user`, {
      headers: {
        "user-agent": request.headers.get("user-agent"),
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
  console.log("PROFILE RES ", response);
  const { success } = response;
  if (success) {
    const { username, email } = response.data;
    return { username, email: email ? email : "" };
  } else {
    return response;
  }
};

export const actions: Actions = {
  updateUser: async ({ cookies, request }) => {
    const form: FormData = await request.formData();
    console.log(form.get("email"), form.get("password"));
    const token = cookies.get("token");
    const email = form.get("email");
    const password = form.get("password");
    console.log("EMAIL ", email, "PASSWORD ", password);
    const response = await axiosInstance
      .put(
        `/user`,
        {
          email: email ? email : "",
          password: password ? password : "",
        },
        {
          headers: {
            "user-agent": request.headers.get("user-agent"),
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => res.data);
    const { success, message } = response;
    return { success, message };
  },
};
