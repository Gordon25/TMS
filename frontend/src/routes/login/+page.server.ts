import { redirect, type Actions } from "@sveltejs/kit";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import type { PageServerLoad } from "./$types";
import { invalidateAll } from "$app/navigation";
import getCookie from "../../utils/cookies";

export const actions: Actions = {
  login: async ({ request }) => {
    // get form inputs
    const form: FormData = await request.formData();
    console.log(form.get("username"));
    console.log(form.get("password"));

    // send to backend
    const response: AxiosResponse | undefined = await axios
      .post("http://localhost:3000/login", {
        username: form.get("username"),
        password: form.get("password"),
      })
      .then((response) => {
        console.log(response?.data);
        return response;
      })
      .catch((error: AxiosError) => {
        return error.response;
      });
    console.log(response?.data);
    const { success, message } = response?.data;
    if (success) {
      throw redirect(303, "/tasklist");
    } else {
      return { success, errorMessage: message };
    }
  },
};
