import { PUBLIC_BACKEND_HOSTNAME } from "$env/static/public";
import { redirect } from "@sveltejs/kit";
import axios, { Axios, AxiosError, type AxiosResponse } from "axios";
import logout from "./logout";
import { goto } from "$app/navigation";
import loginStatus from "./stores/loginStatus";
let isLoggedIn: boolean;
loginStatus.subscribe((status) => (isLoggedIn = status.isLoggedIn));
// import logout from "./logout";
const axiosInstance: Axios = axios.create({
  baseURL: PUBLIC_BACKEND_HOSTNAME, // Your backend API URL
  timeout: 10000, // Optional: Set a timeout
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response, // Return the response for successful requests
  async (error: AxiosError) => {
    const url = error.response?.config.url; // Get the request URL
    const status = error.response?.status; // Get the status code

    if (status === 403) {
      loginStatus.set({ isLoggedIn: true, isAdmin: false });
      throw redirect(301, "/tms");
    } else {
      return Promise.reject(error); // Reject if already at the login page
    }
  }
);

export default axiosInstance;
