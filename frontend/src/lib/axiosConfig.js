import { PUBLIC_BACKEND_HOSTNAME } from "$env/static/public";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: PUBLIC_BACKEND_HOSTNAME, // Your backend API URL
  timeout: 10000, // Optional: Set a timeout
  headers: {
    // Add any custom headers here, e.g. Authorization tokens
  },
  withCredentials: true,
});

export default axiosInstance;
