import { group } from "console";
import connection from "../utils/dbconnection.js";
export default async (req, res) => {
  const username = req.params.username;
  console.log(username);
  try {
    const [[user], userFields] = await connection.query(
      `SELECT username, email FROM users WHERE username=?;`,
      [username]
    );
    const data = { ...user };
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
