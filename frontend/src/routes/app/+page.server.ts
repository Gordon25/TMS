import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ request, cookies, fetch }) => {
  let appAcronym;
  const token = cookies.get("token");
  if (typeof window !== "undefined") {
    appAcronym = localStorage.getItem("app");
  }
  return { token };
};
