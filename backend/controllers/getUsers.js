import { group } from "console";
import connection from "../utils/dbconnection.js";
export default async (req, res) => {
  try {
    const [users, userFields] = await connection.query(
      `SELECT id, username, email, isActive FROM users where isActive=1;`
    );
    const [groups, groupFields] = await connection.query(
      `SELECT username, groupname FROM user_groups;`
    );
    const data = users.map((user) => {
      return {
        ...user,
        email: user.email == null ? "" : user.email,
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
    res.json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};
