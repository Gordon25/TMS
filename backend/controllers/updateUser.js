import connection from "../utils/dbconnection.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
export default async (req, res) => {
  console.log("UPDATE USERSSSSSSSSSSSSSSSss");
  const token = req.headers.authorization.split(" ")[1];
  const { password, email, groups } = req.body;
  console.log(password, email, groups);
  let username;
  try {
    if (req.originalUrl.startsWith("/users/")) {
      username = req.originalUrl.split("/")[2];
    } else {
      username = jwt.verify(token, process.env.JWT_SECRET).username;
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    // update email, password
    await connection.query(
      `UPDATE users SET
      password = IF(? != '', ?, password),
      email = IF(? != '', ?, email)
      where username = ?;`,
      [password, hashedPassword, email, email, username]
    );

    //only admin can edit groups, only admin can access /users/ route
    if (req.originalUrl.startsWith("/users/")) {
      // get current groups
      const [joinedGroups, fields] = await connection.query(
        `SELECT groupname from user_groups
      WHERE username = ?;`,
        username
      );
      const currentJoinedGroups = joinedGroups.map((currentGroup) => currentGroup.groupname);
      // remove unselected groups
      const groupsToRemove = currentJoinedGroups.filter(
        (curr_group) => !groups.includes(curr_group)
      );

      if (groupsToRemove.length > 0) {
        const groupsPlaceholder = groupsToRemove.map(() => "?").join(", ");
        await connection.query(
          `DELETE FROM user_groups
      WHERE username = '${username}' and
      groupname in (${groupsPlaceholder});`,
          groupsToRemove
        );
      }

      // assign user to groups selected
      const groupsToAdd = groups.filter((group) => !currentJoinedGroups.includes(group));
      if (groupsToAdd.length > 0) {
        const newGroupsPlaceholder = groupsToAdd.map(() => "(?, ?)").join(", ");
        const values = groupsToAdd.flatMap((group) => [group, username]);
        await connection.query(
          `INSERT INTO user_groups (groupname, username) VALUES ${newGroupsPlaceholder};`,
          values
        );
      }
    }
    res.status(200).json({
      success: true,
      message: `${username} has been updated.`,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};
