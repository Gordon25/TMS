import { group } from "console";
import connection from "../dbconnection.js";
export default async (req, res) => {
  try {
    const [users, userFields] = await connection.query(
      `SELECT username, email, isActive FROM users;`
    );
    const [groups, groupFields] = await connection.query(`SELECT * FROM user_groups;`);
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
    res.json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};
