import { db } from "./db.js";
const checkgroup = async (username, group) => {
  try {
    let isInGroup = 0;
    let fields;
    [[{ isInGroup }], fields] = await db.execute(
      "select if(count(distinct groupname) > 0, 1, 0) as 'isInGroup' from user_groups where username=? and groupname=?",
      [username, group]
    );
    return { isUserInGroup: isInGroup == 1, message: "" };
  } catch (error) {
    console.log(error);
    const errorMessage =
      "There was an issue processing your request. Please try again after later.";
    return { isUserInGroup: false, message: errorMessage };
  }
};

export default checkgroup;
