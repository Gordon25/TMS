import jwt from "jsonwebtoken";
import checkgroup from "../utils/checkgroup.js";

export default async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const { username } = jwt.verify(token, process.env.JWT_SECRET);
    // const [[{ isAdmin }], fields] = await connection.query(
    //   "select count(distinct groupname) as isAdmin from user_groups where username=? and groupname='Admin';",
    //   username
    // );

    const isAdmin = await checkgroup(username, "Admin");
    res.status(200).json({
      success: true,
      isAdmin: isAdmin,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};
