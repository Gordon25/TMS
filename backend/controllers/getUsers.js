import { group } from "console";
import connection from "../dbconnection.js";
export default async (req, res) => {
  try {
    const [users, userFields] = await connection.query(`SELECT * FROM users;`);
    const [groups, groupFields] = await connection.query(`SELECT * FROM user_groups;`);
    // const data = users.map(user=>return {...user, "groups":})
    const groupnames = groups.map((group) => group.groupname);
    const data = users.map((user) => {
      return {
        ...user,
        groups: groups
          .filter((group) => group.username === user.username)
          .map((group) => group.groupname),
      };
    });
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error.stack);
    res.json(error.status).json({
      success: false,
      message: error.message,
    });
  }
};
