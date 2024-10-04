import connection from "../utils/dbconnection.js";
import bcryptjs from "bcryptjs";
export default async (req, res) => {
  console.log("ADMIN UPDATE USERSSSSSSSSSSSSSSSss");
  const operation = "create user";
  const { password, email, groups, isActive } = req.body;
  const { username } = req.params.username;
  console.log(password, email, groups, isActive);
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    // update email, password, isActive
    await connection.query(
      `UPDATE users SET
      password = IF(? != '', ?, password),
      email = IF(? != '', ?, email)
      isActive = ?,
      where username = ?;`,
      [password, hashedPassword, email, email, isActive, username]
    );

    // get current groups
    const currentJoinedGroups = await connection
      .query(
        `SELECT groupname from user_groups
      WHERE username = ?;`,
        username
      )
      .then(([groups, fields]) => groups)
      .then((groups) => groups.map((group) => group.groupname));

    // get unselected groups to be removed
    const groupsToRemove = currentJoinedGroups.filter((curr_group) => !groups.includes(curr_group));
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

    if (!isActive) {
      res.status(200).json({
        success: true,
        operation: "disable user",
        message: `${username} has been disabled.`,
      });
    } else {
      res.status(200).json({
        success: true,
        operation,
        message: `${username} has been updated.`,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      operation,
      message: error.message,
      stack: error.stack,
    });
  }
};
