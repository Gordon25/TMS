import { db } from "../utils/db.js";
import bcryptjs from "bcryptjs";
export default async (req, res) => {
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

      await db.execute(
        `INSERT INTO accounts (username, password, email, isActive) 
        VALUES (?, ?, ?, ?);`,
        [username, passwordHash, emailInserted, isActive]
      );

      // add user to groups
      if (groups.length != 0) {
        // assign user to groups
        const newEntries = groups.map(() => "(?, ?)").join(", ");
        const values = groups.flatMap((group) => [group, username]);
        await db.execute(
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
      console.log(error);
      res.status(500).json({
        sucess: false,
        field,
        message: "Internal Server error.",
      });
    }
  }
};
