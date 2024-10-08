import { connection } from "../utils/dbconnection.js";
export default async (req, res, next) => {
  const field = "username";
  const usernameRegex = new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$");
  const { username } = req.body;
  const isValidUsername = usernameRegex.test(username);
  if (!isValidUsername) {
    //username not alphanumeric
    res.status(200).json({
      success: false,
      field,
      message: "Username is not alphanumeric.",
    });
  } else {
    try {
      const [matchedUsernames, fields] = await connection.query(
        `select username from accounts where username=?;`,
        username
      );

      if (matchedUsernames.length != 0) {
        //duplicate username
        res.status(200).json({
          success: false,
          field,
          message: `${username} has already been taken, choose another one.`,
        });
      } else {
        //username valid and unqiue
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        field,
        message: "Internal Server error.",
      });
    }
  }
};
