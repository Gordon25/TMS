import connection from "./dbconnection.js";
const checkgroup = async (username, group) => {
  try {
    let isInGroup = 0;
    let fields;
    [[{ isInGroup }], fields] = await connection.query(
      "select if(count(distinct groupname) > 0, 1, 0) as 'isInGroup' from user_groups where username=? and groupname=?",
      [username, group]
    );
    return { isUserInGroup: isInGroup == 1, message: "" };
  } catch (error) {
    const errorMessage =
      "There was an issue processing your request. Please try again after later.";
    return { isUserInGroup: false, message: errorMessage };
  }
};

export default checkgroup;
