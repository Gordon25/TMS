import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
const updateEmailController = async (req, res) => {
  const operation = "update email";
  const { email } = req.body;
  // update email
  if (trim(email) === "") {
    res.status(200).json({
      success: false,
      operation,
      message: "New email is not provided, email is not updated.",
    });

    try {
      const token = req.headers.authorization.split(" ")[1];
      const { username } = jwt.verify(token, process.env.JWT_SECRET);
      await connection.query(
        `UPDATE users SET email = ?
          where username = ?;`,
        [email, username]
      );
      res.status(200).json({
        success: true,
        operation,
        message: `${username} email updated.`,
      });
    } catch (error) {
      res.json({
        success: false,
        operation,
        message: error.message,
      });
    }
  }
};

const updatePasswordController = async (req, res) => {
  const operation = "update password";
  const { password } = req.body;
  // update email
  if (trim(password) === "") {
    res.statusjson({
      success: false,
      operation,
      message: "New password is not provided, password is not updated.",
    });
  } else {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { username } = jwt.verify(token, process.env.JWT_SECRET);
      const hashedPassword = await bcryptjs.hash(password, 10);
      await connection.query(
        `UPDATE users SET password = ?
          where username = ?;`,
        [hashedPassword, username]
      );
      res.status(200).json({
        success: true,
        operation,
        message: `${username} password updated.`,
      });
    } catch (error) {
      res.json({
        success: false,
        operation,
        message: error.message,
      });
    }
  }
};

export { updateEmailController, updatePasswordController };
