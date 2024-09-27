import connection from "../dbconnection.js";
export default async (req, res, next) => {
  const usernameRegex = new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$");
  const { username } = req.body;
  const isValidUsername = usernameRegex.test(username);
  if (!isValidUsername) {
    //username not alphanumeric
    res.status(400).json({
      success: false,
      message: "Username is not alphanumeric.",
    });
  } else {
    try {
      const [matchedUsernames, fields] = await connection.query(
        `select username from users where username=?;`,
        username
      );

      if (matchedUsernames.length != 0) {
        //duplicate username
        res.status(400).json({
          success: false,
          message: `${username} has already been taken, choose another one.`,
        });
      } else {
        //username valid and unqiue
        next();
      }
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
        stack: error.stack,
      });
    }
  }
};
