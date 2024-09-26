import { group } from "console";
import connection from "../dbconnection.js";
export default async (req, res) => {
  const username = req.params.username;
  console.log(username);
  try {
    const [[user], userFields] = await connection.query(`SELECT * FROM users WHERE username=?;`, [
      username,
    ]);
    const [groups, groupFields] = await connection.query(
      "SELECT groupname FROM user_groups WHERE username=?;",
      username
    );
    const data = { ...user, groups: groups.map((group) => group.groupname) };
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
