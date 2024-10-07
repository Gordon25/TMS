import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// export const load: PageServerLoad = async ({ cookies, request }) => {
//   const token = cookies.get("token");
//   if (token) {
//     // user already logged in
//     throw redirect(301, "/tms");
//   }
// };
