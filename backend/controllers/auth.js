const jwt = require("jsonwebtoken");
const asynConnection = require("../db");
const authUsers = (req, res, next) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
  }
  next();
};

const authGroups = (...users) => {
  return async (req, res, next) => {
    try {
      const connection = await asynConnection;
      const userId = req.userId;
      const [groups, fields] = await connection.query(
        `select groupname from grouplists where userid=${userId}`
      );

      const userPermittedGroups = groups.filter((group) => users.includes(group.groupname));

      if (userPermittedGroups.length === 0) {
        //not permitted to access
        res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Granted access",
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
};

module.exports = { authUsers, authGroups };
