import axiosInstance from "../../lib/axiosConfig";
import type { PageServerLoad } from "./$types";

const load: PageServerLoad = async ({ cookies, request }) => {
  const token = cookies.get("token");
  const response = await axiosInstance.get("/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      "user-agent": request.headers.get("user-agent"),
    },
  });

  const { success } = response;
  if (success) {
    const { username, email } = response.data;
    return { success, username, email: email ? email : "" };
  } else {
    const { success, message } = response;
    return { success, message };
  }
};
