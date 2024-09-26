import bcryptjs from "bcryptjs";
import connection from "../dbconnection.js";
import jwt from "jsonwebtoken";
export default async (req, res) => {
  console.log(req.cookies);
  const { username: loginUsername, password: loginPassword } = req.body;
  const [[user], fields] = await connection.query(`select * from users where username=?`, [
    [loginUsername],
  ]);
  console.log("ENTRIES", user, !user);
  const isPasswordMatch = bcryptjs.compare(loginPassword, user.password);
  if (!user || !isPasswordMatch) {
    res.status(401).json("Invalid login credentials");
  } else if (!user.isActive) {
    res.status(403).json("Account disabled");
  } else {
    //login successful

    //create jwt
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });

    //create cookie
    const options = {
      expires: new Date(Date.now() + process.env.COOKIES_EXPIRES_TIME * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      token,
    });
  }
};
