import connection from "../utils/dbconnection.js";
import bcryptjs from "bcryptjs";
export default async (req, res, next) => {
  const { username, password, email, groups, isActive } = req.body;
  console.log(username, password, email, groups);
  if (password === "") {
    res.status(200).json({
      success: false,
      message: "Password is mandatory.",
    });
  } else {
    try {
      // all fields valid
      // encrypt password with bcryptjs
      const passwordHash = await bcryptjs.hash(password, 10);
      const emailInserted = email == "" ? null : email;
      console.log("inserting");
      await connection.query(
        `INSERT INTO  users (username, password, email, isActive) 
        VALUES (?, ?, ?, ?);`,
        [username, passwordHash, emailInserted, isActive]
      );
      console.log("Inserted");
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
        operation: "create user",
        message: "User account created",
      });
    } catch (error) {
      res.json({
        sucess: false,
        message: error.message,
        stack: error.stack,
      });
    }
  }
};
