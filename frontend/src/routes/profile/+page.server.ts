import type { PageServerLoad } from "./$types";
import axiosInstance from "$lib/axiosConfig";
import { redirect, type Actions } from "@sveltejs/kit";
import handleError from "$lib/errorHandler";
export const load: PageServerLoad = async ({ request, cookies }) => {
  const token = cookies.get("token");
  if (!token) {
    throw redirect(300, "/login");
  }
  let success: boolean = false;
  let username, email, message;
  try {
    const responseData = await axiosInstance
      .get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "user-agent": request.headers.get("user-agent"),
        },
      })
      .then((res) => {
        let data = res.data;
        ({ success } = data);
        if (success) {
          ({ username, email } = data.data);
          return { success, username, email: email ? email : "" };
        } else {
          ({ success, message } = data);
          return { success, message };
        }
      });
    return responseData;
  } catch (error) {
    await handleError(error);
  }
};

export const actions: Actions = {
  updateEmail: async ({ request, cookies }) => {
    const token = cookies.get("token");
    const form: FormData = await request.formData();
    try {
      const responseData = await axiosInstance
        .put(
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
        )
        .then((res) => {
          let data = res.data;
          const { success, field, message } = data;
          return { success, field, message };
        });
      return responseData;
    } catch (error) {
      await handleError(error);
    }
  },
  updatePassword: async ({ cookies, request }) => {
    const token = cookies.get("token");
    const form: FormData = await request.formData();
    try {
      const responseData = await axiosInstance
        .put(
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
        )
        .then((res) => {
          let data = res.data;
          const { success, field, message } = data;
          return { success, field, message };
        });
      return responseData;
    } catch (error) {
      await handleError(error);
    }
  },
};
