import { PUBLIC_BACKEND_HOSTNAME } from "$env/static/public";
import { redirect } from "@sveltejs/kit";
import axios, { Axios, AxiosError, type AxiosResponse } from "axios";
import logout from "./logout";
import { goto } from "$app/navigation";
// import logout from "./logout";
const axiosInstance: Axios = axios.create({
  baseURL: PUBLIC_BACKEND_HOSTNAME, // Your backend API URL
  timeout: 10000, // Optional: Set a timeout
  headers: {
    // Add any custom headers here, e.g. Authorization tokens
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response, // Return the response for successful requests
  async (error: AxiosError) => {
    const url = error.response?.config.url; // Get the request URL
    const status = error.response?.status; // Get the status code

    if (status === 403) {
      throw redirect(301, "/tms");
    } else if (status === 401) {
      if (url === "/login") {
        return Promise.reject(error.response); // Reject if already at the login page
      } else {
        console.log("UNAUTHORIZED ", url);
        await logout(); // Call your logout function
        return Promise.reject(error.response);
      }
    } else {
      console.log("ERROR STATUS", error.code, "MESSAGE", error.message, "URL ", url);
      await logout(); // Call your logout function
      return Promise.reject(error.response);
    }
  }
);

export default axiosInstance;
