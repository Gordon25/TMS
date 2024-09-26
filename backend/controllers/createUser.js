import connection from "../dbconnection.js";
import bcryptjs from "bcryptjs";
export default async (req, res, next) => {
  const { username, password, email, groups, isActive } = req.body;
  console.log(username, password, email, groups);
  // encrypt password with bcryptjs
  const passwordHash = bcryptjs.hash(password, 10);
  try {
    // all fields valid
    console.log("inserting");
    await connection.query(
      `INSERT INTO  users (username, password, email, isActive) 
        VALUES (?, ?, ?, ?);`,
      [username, passwordHash, email ? email : NULL, isActive]
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
        [values]
      );
    }
    res.status(200).json({
      success: true,
      message: "User account created",
    });
  } catch (error) {
    console.log(error.stack);
    res.status(error.status).json({
      sucess: false,
      message: error.message,
      stack: error.stack,
    });
  }
};
