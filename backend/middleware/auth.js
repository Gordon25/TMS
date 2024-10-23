import jwt from "jsonwebtoken";
import { db } from "../utils/db.js";
import checkgroup from "../utils/checkgroup.js";
const authLogin = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized, login first.",
    });
  } else {
    try {
      const { username, ip, browserType } = jwt.verify(token, process.env.JWT_SECRET);

      const [[{ isActive }], field] = await db.execute(
        "select isActive from accounts where username = ?",
        [username]
      );
      if (ip != req.ip || browserType != req.headers["user-agent"]) {
        res.status(401).json({
          success: false,
          message: "Unauthorised access.",
        });
      } else if (!isActive) {
        const options = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        };
        res.clearCookie("token");
        res.status(401).json({
          success: false,
          message: "Account has been disabled.",
        });
      } else {
        req.username = username;

        next();
      }
    } catch (error) {
      if (error.name == "TokenExpiredError") {
        res.status(401).json({
          success: false,
          message: "Your session has expired. Please sign in again.",
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Invalid JWT. " + error.message,
          errorname: error.name,
        });
      }
    }
  }
};

const authGroups = (...permittedGroups) => {
  return async (req, res, next) => {
    try {
      const username = req.username;
      let isAuthorized = false;
      let isUserInGroup = false;
      let i;
      let errorMessage = "";
      let hasError = false;
      for (i = 0; i < permittedGroups.length; i++) {
        const res = await checkgroup(username, permittedGroups[i]);
        isUserInGroup = res.isUserInGroup;
        if (res.message != "") {
          hasError = true;
          errorMessage = res.message;
          break;
        } else if (isUserInGroup) {
          isAuthorized = true;
          break;
        }
      }
      if (hasError) {
        res.status(500).json({
          success: false,
          message: errorMessage,
        });
      } else if (!isAuthorized) {
        res.status(403).json({
          success: false,
          message: "User does not have authorized access, please find admin.",
        });
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: "Internal Server error.",
      });
    }
  };
};

export { authLogin, authGroups };
