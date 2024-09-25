const asyncConnection = require("../db");
module.exports = async (req, res, next) => {
  const { username } = req.body;
  const isValidUsername = verifyUsernameFormat(username);
  if (!isValidUsername) {
    //username not alphanumeric
    res.status(200).json({
      message: "Username is not alphanumeric.",
    });
  } else {
    try {
      const connection = await asyncConnection;
      const [matchedUsernames, fields] = await connection.query(
        `select username from users where username='${username}';`
      );

      if (matchedUsernames.length != 0) {
        hasInvalidFields = true;
        //duplicate username
        res.status(200).json({
          message: `${username} has already been taken, choose another one.`,
        });
      } else {
        //username valid and unqiue
        next();
      }
    } catch (error) {
      res.json(error.status).json(error.message);
    }
  }
};
function verifyUsernameFormat(username) {
  const usernameRegex = new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$");
  return usernameRegex.test(username);
}
