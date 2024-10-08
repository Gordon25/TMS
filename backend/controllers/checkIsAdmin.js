import jwt from "jsonwebtoken";
import checkgroup from "../utils/checkgroup.js";

export default async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const { username } = jwt.verify(token, process.env.JWT_SECRET);
    const { isUserInGroup, message } = await checkgroup(username, "Admin");
    if (message != "") {
      res.status(500).json({
        success: false,
        message,
      });
    } else {
      res.status(200).json({
        success: true,
        isAdmin: isUserInGroup,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};
