import jwt from "jsonwebtoken";
import asynConnection from "../dbconnection.js";
const authLogin = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    // user not logged in
    res.status(401).json({
      success: false,
      message: "Unauthorized, login first",
    });
  } else {
    try {
      const { username } = jwt.verify(token, process.env.JWT_SECRET);
      req.username = username;
      next();
    } catch (error) {
      if (error.name == "TokenExpiredError") {
        res
          .status(401)
          .json({ success: false, message: "You have been logged out, please log in again" });
        //remove token, log user out
      } else {
        // Need?
        res.status(401).json({ success: false, message: "Invalid JWT." });
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
          message: "Unauthorized access",
        });
      } else {
        req.permittedGroups = users;
        next();
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
};

const authUser = (req, res, next) => {
  const queryUsername = req.params.username;
  const reqUsername = req.username;
  console.log(queryUsername, reqUsername);
  if (queryUsername == reqUsername) {
    next();
  } else {
    res.status(400).json({
      success: false,
      message: "Access Denied, not permitted to access this data",
    });
    //redirect user?
  }
};

export { authLogin, authGroups, authUser };
