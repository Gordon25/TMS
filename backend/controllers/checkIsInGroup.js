import jwt from "jsonwebtoken";
import checkgroup from "../utils/checkgroup.js";

export default (permittedGroup) => {
  return async (req, res) => {
    const token = req.cookies.token;

    try {
      const { username } = jwt.verify(token, process.env.JWT_SECRET);
      const { isUserInGroup, message } = await checkgroup(username, permittedGroup);
      if (message != "") {
        res.status(500).json({
          success: false,
          message,
        });
      } else {
        res.status(200).json({
          success: true,
          isInGroup: isUserInGroup,
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
};
