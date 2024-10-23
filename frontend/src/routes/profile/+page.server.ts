import type { PageServerLoad } from "./$types";
import axiosInstance from "$lib/axiosConfig";
import { redirect, type Actions } from "@sveltejs/kit";
export const load: PageServerLoad = async ({ request, cookies }) => {
  const token = cookies.get("token");
  if (!token) {
    throw redirect(300, "/login");
  }
  let success: boolean = false;
  let username, email, message;
  const responseData = await axiosInstance
    .get("/user", {
      headers: {
        "user-agent": request.headers.get("user-agent"),
        Cookie: `token=${token}`,
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
    })
    .catch((err) => {
      if (err.status === 401) {
        throw redirect(303, "/login");
      } else {
        console.log(err.status);
      }
    });
  return responseData;
};

export const actions: Actions = {
  updateEmail: async ({ request, cookies }) => {
    const token = cookies.get("token");
    const form: FormData = await request.formData();

    const responseData = await axiosInstance
      .put(
        "/user/email",
        {
          email: form.get("email"),
        },
        {
          headers: {
            "user-agent": request.headers.get("user-agent"),
            Cookie: `token=${token}`,
          },
        }
      )
      .then((res) => {
        let data = res.data;
        const { success, field, message } = data;
        return { success, field, message };
      })
      .catch((error) => {
        if (error.status === 401) {
          throw redirect(303, "/login");
        } else {
          console.log(error.status);
        }
      });
    return responseData;
  },
  updatePassword: async ({ cookies, request }) => {
    const token = cookies.get("token");
    const form: FormData = await request.formData();
    const responseData = await axiosInstance
      .put(
        `/user/password`,
        {
          password: form.get("password"),
        },
        {
          headers: {
            Cookie: `token=${token}`,
            "user-agent": request.headers.get("user-agent"),
          },
        }
      )
      .then((res) => {
        let data = res.data;
        const { success, field, message } = data;
        return { success, field, message };
      })
      .catch((error) => {
        if (error.status === 401) {
          throw redirect(303, "/login");
        } else {
          console.log(error.status);
        }
      });
    return responseData;
  },
};
