import { connection } from "../utils/dbconnection.js";
import jwt from "jsonwebtoken";
export default async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const { username } = jwt.verify(token, process.env.JWT_SECRET);
    const [[user], Fields] = await connection.query(
      `SELECT username, email FROM accounts WHERE username=?;`,
      [username]
    );
    const data = { ...user };
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};
