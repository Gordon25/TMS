import { db } from "../utils/db.js";
import jwt from "jsonwebtoken";
export default async (req, res) => {
  const token = req.cookies.token;
  try {
    const { username } = jwt.verify(token, process.env.JWT_SECRET);
    const [[user], Fields] = await db.execute(
      `SELECT username, email FROM accounts WHERE username=?;`,
      [username]
    );
    const data = { ...user };
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};
