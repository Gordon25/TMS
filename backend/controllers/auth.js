import jwt from "jsonwebtoken";
import asynConnection from "../utils/dbconnection.js";
const authLogin = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log("LOGIN TOKEN ", req.headers.authorization, token);
  if (!token) {
    // user not logged in
    res.status(401).json({
      success: false,
      message: "Unauthorized, login first.",
    });
  } else {
    try {
      
      const { username, ip, browserType } = jwt.verify(token, process.env.JWT_SECRET);
      console.log(
        "HEADER ",
        req.headers["user-agent"],
        "URL",
        req.headers,
        browserType != req.headers["user-agent"],
        req.ip != ip
      );
      if (ip != req.ip || browserType != req.headers["user-agent"]) {
        console.log(ip, req.ip, "TOKEN ", browserType, "REQS ", req.headers["user-agent"]);
        // Do not allow copy and pasting to different PC or browser
        res.status(401).json({
          success: false,
          message: "Unauthorised access.",
        });
      } else {
        req.username = username;
        console.log("USERNAME ", req.username);
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
          message: "Invalid JWT.",
          errorname: error.name,
        });
      }
    }
  }
};

const authGroups = (...users) => {
  return async (req, res, next) => {
    try {
      const connection = await asynConnection;
      const username = req.username;

      const [groups, fields] = await connection.query(
        `select groupname from user_groups where username=?`,
        username
      );

      const userPermittedGroups = groups.filter((group) => users.includes(group.groupname));

      if (userPermittedGroups.length === 0) {
        //not permitted to access
        res.status(401).json({
          success: false,
          message: "User does not have authorized access, please find admin.",
        });
      } else {
        next();
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        stack: error.stack,
      });
    }
  };
};

export { authLogin, authGroups };
