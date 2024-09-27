import bcryptjs from "bcryptjs";
import connection from "../utils/dbconnection.js";
import jwt from "jsonwebtoken";
export default async (req, res) => {
  console.log(req.cookies);
  console.log(req.body);
  const { username: loginUsername, password: loginPassword } = req.body;
  const [entries, fields] = await connection.query(`select * from users where username=?`, [
    loginUsername,
  ]);
  console.log("IP ADDRESS ", req.ip, JSON.stringify(req.ip), req.headers["user-agent"]);
  if (entries.length === 0) {
    res.status(401).json({
      // wrong username
      success: false,
      message: "Invalid login credentials",
    });
  } else {
    // username matches a user
    const [user] = entries;
    const isPasswordMatch = await bcryptjs.compare(loginPassword, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({
        // wrong password
        success: false,
        message: "Invalid login credentials",
      });
    } else if (!user.isActive) {
      // disabled users not allowed to login
      res.status(403).json({
        success: false,
        message: "Account disabled",
      });
    } else {
      //login successful

      //create jwt
      const token = jwt.sign(
        {
          username: user.username,
          ip: req.ip,
          browserType: req.headers["user-agent"],
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_TIME,
        }
      );

      //create cookie
      const options = {
        expires: new Date(Date.now() + process.env.COOKIES_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
      };
      // set cookie in browser
      res.status(200).cookie("token", token, options).json({
        success: true,
        username,
        token,
      });
    }
  }
};
