import connection from "../utils/dbconnection.js";
import bcryptjs from "bcryptjs";
export default async (req, res, next) => {
  const field = "user";
  const { username, password, email, groups, isActive } = req.body;

  if (password === "") {
    res.status(200).json({
      success: false,
      field: "password",
      message: "Password is mandatory.",
    });
  } else {
    try {
      // all fields valid
      // encrypt password with bcryptjs
      const passwordHash = await bcryptjs.hash(password, 10);
      const emailInserted = email == "" ? null : email;

      await connection.query(
        `INSERT INTO accounts (username, password, email, isActive) 
        VALUES (?, ?, ?, ?);`,
        [username, passwordHash, emailInserted, isActive]
      );

      // add user to groups
      if (groups.length != 0) {
        // assign user to groups
        const newEntries = groups.map(() => "(?, ?)").join(", ");
        const values = groups.flatMap((group) => [group, username]);
        await connection.query(
          `INSERT INTO user_groups (groupname, username)
         VALUES ${newEntries};`,
          values
        );
      }
      res.status(200).json({
        success: true,
        field,
        message: `User account ${username} created.`,
      });
    } catch (error) {
      res.status(500).json({
        sucess: false,
        field,
        message: error.message,
        stack: error.stack,
      });
    }
  }
};
