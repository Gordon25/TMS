import jwt from "jsonwebtoken";
import asynConnection from "../utils/dbconnection.js";
import connection from "../utils/dbconnection.js";
import checkgroup from "../utils/checkgroup.js";
const authLogin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    // user not logged in
    res.status(401).json({
      success: false,
      message: "Unauthorized, login first.",
    });
  } else {
    try {
      const { username, ip, browserType } = jwt.verify(token, process.env.JWT_SECRET);

      const [[{ isActive }], field] = await connection.query(
        "select isActive from accounts where username = ?",
        username
      );

      if (ip != req.ip || browserType != req.headers["user-agent"]) {
        // Do not allow copy and pasting to different PC or browser
        res.status(401).json({
          success: false,
          message: "Unauthorised access.",
        });
      } else if (!isActive) {
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
        //remove token, log user out?
        res;
      } else {
        // Need?
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
      const connection = await asynConnection;
      const username = req.username;

      const [groups, fields] = await connection.query(
        `select groupname from user_groups where username=?`,
        username
      );
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
        // const userPermittedGroups = groups.filter((group) => groups.includes(group.groupname));
      } else if (!isAuthorized) {
        //not permitted to access
        res.status(403).json({
          success: false,
          message: "User does not have authorized access, please find admin.",
        });
      } else {
        next();
      }
    } catch (error) {
      console.log("Error ", error);
      res.json({
        success: false,
        message: error.message,
      });
      // res.status(500).json({
      //   success: false,
      //   message: error.message,
      // });
    }
  };
};

export { authLogin, authGroups };
