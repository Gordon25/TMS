import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { db } from "../utils/db.js";
const updateEmailController = async (req, res) => {
  const field = "email";
  const { email } = req.body;
  // update email
  if (email.trim() === "") {
    res.status(200).json({
      success: false,
      field,
      message: "New email is not provided, email is not updated.",
    });
  } else {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { username } = jwt.verify(token, process.env.JWT_SECRET);
      await db.execute(
        `UPDATE accounts SET email = ?
          where username = ?;`,
        [email, username]
      );
      res.status(200).json({
        success: true,
        field,
        message: `${username} email updated to ${email}.`,
      });
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        field,
        message: "Internal Server error.",
      });
    }
  }
};

const updatePasswordController = async (req, res) => {
  const field = "password";
  const { password } = req.body;
  // update email
  if (password.trim() === "") {
    res.status(200).json({
      success: false,
      field,
      message: "New password is not provided, password is not updated.",
    });
  } else {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { username } = jwt.verify(token, process.env.JWT_SECRET);
      const hashedPassword = await bcryptjs.hash(password, 10);
      await db.execute(
        `UPDATE accounts SET password = ?
          where username = ?;`,
        [hashedPassword, username]
      );
      res.status(200).json({
        success: true,
        field,
        message: `${username} password updated to ${password}.`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        field,
        message: "Internal Server error.",
      });
    }
  }
};

export { updateEmailController, updatePasswordController };
