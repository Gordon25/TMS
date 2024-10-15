import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = ({ cookies }) => {
  const token = cookies.get("token");
  return { token };
};
