import type { PageServerLoad } from "./$types";
import { AxiosError, type AxiosResponse } from "axios";
import axiosInstance from "$lib/axiosConfig";
import { redirect, type Actions } from "@sveltejs/kit";
export const load: PageServerLoad = async ({ request, cookies }) => {
  const token = cookies.get("token");
  const response = await axiosInstance.get("/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      "user-agent": request.headers.get("user-agent"),
    },
  });

  const { success } = response;
  if (success) {
    const { username, email } = response.data;
    return { success, username, email: email ? email : "" };
  } else {
    const { success, message } = response;
    return { success, message };
  }
};

export const actions: Actions = {
  updateEmail: async ({ request, cookies }) => {
    const token = cookies.get("token");
    const form: FormData = await request.formData();
    const responseData = await axiosInstance.put(
      "/user/email",
      {
        email: form.get("email"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "user-agent": request.headers.get("user-agent"),
        },
      }
    );

    const { success, field, message } = responseData;
    return { success, field, message };
  },
  updatePassword: async ({ cookies, request }) => {
    const token = cookies.get("token");
    const form: FormData = await request.formData();
    const responseData = await axiosInstance.put(
      `/user/password`,
      {
        password: form.get("password"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "user-agent": request.headers.get("user-agent"),
        },
      }
    );

    const { success, field, message } = responseData;
    return { success, field, message };
  },
};
