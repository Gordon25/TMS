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

// axiosInstance.interceptors.request.use()
// axiosInstance.interceptors.response.use(undefined, async (error: AxiosError) => {
//   const url = error.response?.config.url;
//   const token = error.response?.headers["set-cookie"];
//   if (error.status === 403) {
//     throw redirect(301, "/tms");
//   } else if (error.status === 401 && url != "/login") {
//     await logout();
//     throw redirect(301, "/login");
//   } else {
//     console.log("ERROR STATUS", error.code, "MESSAGE ", error.message);
//     await logout();
//     throw redirect(301, "/login");
//   }
// });

export default axiosInstance;
