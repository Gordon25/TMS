import type { PageServerLoad } from "./$types";
import { PUBLIC_BACKEND_HOSTNAME } from "$env/static/public";
import type { AxiosResponse, AxiosError } from "axios";
import type { Actions } from "@sveltejs/kit";
import axiosInstance from "$lib/axiosConfig";
export const load: PageServerLoad = async ({ request, cookies }) => {
  const token = cookies.get("token");
  const usersResult = await axiosInstance
    .get(`/users`, {
      headers: {
        "user-agent": request.headers.get("user-agent"),
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res: AxiosResponse) => res.data)
    .catch((res: AxiosError) => res.response?.data);

  const groupsResult = await axiosInstance
    .get(`/groups`, {
      headers: {
        "user-agent": request.headers.get("user-agent"),
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res: AxiosResponse) => res.data)
    .catch((res: AxiosError) => res.response?.data);
  const { userSuccess } = usersResult;
  console.log("USERS RESULTS ", usersResult);
  const { groupSuccess } = groupsResult;
  const data = {
    users: usersResult.data || [],
    userError: usersResult.message || "",
    groups: groupsResult.data || [],
    groupError: groupsResult.message || "",
    token,
  };
  console.log("DATAAAAAAAAAAAAAAA ", data);
  return data;
};

export const actions: Actions = {
  createGroup: async ({ request, cookies }) => {
    const form: FormData = await request.formData();
    const token = cookies.get("token");
    const groupname = form.get("groupname");
    console.log("Groups ", groupname);
    const response = await axiosInstance
      .post(
        `${PUBLIC_BACKEND_HOSTNAME}/groups`,
        {
          groupname,
        },
        {
          headers: {
            "user-agent": request.headers.get("user-agent"),
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      .then((res: AxiosResponse) => res.data)
      .catch((err: AxiosError) => err.response?.data);

    return response;
  },
  createUser: async ({ request, cookies }) => {
    const form: FormData = await request.formData();
    console.log("FORM ", form);
    const token = cookies.get("token");
    const username = form.get("new-username");
    const password = form.get("new-password");
    const email = form.get("new-email");
    let groups;
    if (!form.get("new-groups")) {
      groups = [];
    } else if (form.get("new-groups") instanceof String) {
      groups = [form.get("new-groups")];
    } else {
      groups = form.get("new-groups");
    }
    const isActive = form.get("new-isActive") != null;
    console.log("Sending data ");
    const response = await axiosInstance
      .post(
        `${PUBLIC_BACKEND_HOSTNAME}/users`,
        {
          username,
          password,
          email,
          isActive,
          groups,
        },
        {
          headers: {
            "user-agent": request.headers.get("user-agent"),
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => res.data);
    console.log("RESPONSEEEEEEEE ", response);
    return response;
  },
  updateUser: async ({ request, cookies }) => {
    const form: FormData = await request.formData();
    console.log("FORM ", form);
    const token = cookies.get("token");
    const username = form.get("username");
    const password = form.get("password");
    const email = form.get("email");
    let groups;
    if (!form.get("groups")) {
      groups = [];
    } else if (form.get("groups") instanceof String) {
      groups = [form.get("groups")];
    } else {
      groups = form.get("groups");
    }
    console.log("UPDATING USERS ", username, password, email, groups);
    const isActive = form.get("isActive") != null;
    console.log("Sending data ");
    const response = await axiosInstance
      .put(
        `${PUBLIC_BACKEND_HOSTNAME}/users/${username}`,
        {
          password,
          email,
          isActive,
          groups,
        },
        {
          headers: {
            "user-agent": request.headers.get("user-agent"),
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => res.data);
    console.log("UPDATE RESPONSEEEEEEEE ", response);
    return response;
  },
};
