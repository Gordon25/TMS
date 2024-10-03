import { PUBLIC_BACKEND_HOSTNAME } from "$env/static/public";

import type { LayoutServerLoad } from "./$types";
import axios from "axios";
import { AxiosError, type AxiosResponse } from "axios";
import { redirect, type Actions } from "@sveltejs/kit";
export const load: LayoutServerLoad = async ({ cookies, depends, request, url }) => {
  let token = cookies.get("token");
  let isLoggedIn = false;
  let isAdmin = false;
  console.log("GETTING TOKEN", token, url.pathname);
  if (url.pathname != "/login") {
    console.log("LOADDINGNGG");
    isLoggedIn = true;
    const response = await axios
      .get(`${PUBLIC_BACKEND_HOSTNAME}/checkIsAdmin`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": request.headers.get("user-agent"),
        },
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((err: AxiosError) => err.response?.data);

    console.log("IS ADMIN RESPONSE ", response);
    const { success } = response;
    if (success) {
      isAdmin = response.isAdmin;
    }
  }
  console.log("RETURNNINGG ", isLoggedIn, isAdmin, token);
  return { isLoggedIn, isAdmin, token };
};
