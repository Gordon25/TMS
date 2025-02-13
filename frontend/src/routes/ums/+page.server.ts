import type { PageServerLoad } from "./$types";
import axiosInstance from "$lib/axiosConfig";
import { redirect, type Actions } from "@sveltejs/kit";
export const load: PageServerLoad = async ({ request, cookies }) => {
  const token = cookies.get("token");
  if (!token) {
    throw redirect(300, "/login");
  }
  const usersResult = await axiosInstance
    .get(`/users`, {
      headers: {
        "user-agent": request.headers.get("user-agent"),
        Cookie: `token=${token}`,
      },
      withCredentials: true,
    })
    .then((res) => res.data);

  const groupsResult = await axiosInstance
    .get(`/groups`, {
      headers: {
        "user-agent": request.headers.get("user-agent"),
        Cookie: `token=${token}`,
      },
      withCredentials: true,
    })
    .then((res) => res.data);

  const data = {
    users: usersResult?.data || [],
    userError: usersResult?.message || "",
    groups: groupsResult?.data || [],
    groupError: groupsResult?.message || "",
    token,
  };
  return data;
};

export const actions: Actions = {
  createGroup: async ({ request, cookies }) => {
    const form: FormData = await request.formData();
    const token = cookies.get("token");
    const groupname = form.get("groupname");

    const responseData = await axiosInstance
      .post(
        "/groups",
        {
          groupname,
        },
        {
          headers: {
            "user-agent": request.headers.get("user-agent"),
            Cookie: `token=${token}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        let data = res.data;
        const { success, field, message } = data;
        if (success) {
          return { success, field, message };
        } else {
          return { success, field, message, groupname };
        }
      })
      .catch((error) => console.log(error));

    return responseData;
  },
  createUser: async ({ request, cookies }) => {
    const form: FormData = await request.formData();

    const token = cookies.get("token");
    const username = form.get("new-username");
    const password = form.get("new-password");
    const email = form.get("new-email");
    const multiselectGroups = form.get("new-groups");
    let groups: string[] = [];
    if (multiselectGroups && multiselectGroups !== "") {
      groups = multiselectGroups.toString().split(",");
    }
    const isActive = form.get("new-isActive") == "on";

    const responseData = await axiosInstance
      .post(
        "/users",
        {
          username,
          password,
          email,
          groups,
          isActive,
        },
        {
          headers: {
            "user-agent": request.headers.get("user-agent"),
            Cookie: `token=${token}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        let data = res.data;
        const { success, field, message } = data;
        if (success) {
          return { success, field, message };
        } else {
          return { success, field, message, username, password, email, groups, isActive };
        }
      });

    return responseData;
  },
};
