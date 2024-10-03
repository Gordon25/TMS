import connection from "./dbconnection.js";
const checkgroup = async (username, group) => {
  const [[{ isInGroup }], fields] = await connection.query(
    "select if(count(distinct groupname) > 0, 1, 0) as 'isInGroup' from user_groups where username=? and groupname=?",
    [username, group]
  );
  return isInGroup == 1;
};

export default checkgroup;
