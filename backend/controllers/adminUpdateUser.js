import { connection } from "../utils/dbconnection.js";
import bcryptjs from "bcryptjs";
export default async (req, res) => {
  const field = "user";
  const { password, email, groups, isActive } = req.body;
  const { username } = req.params;
  if (username === process.env.ADMIN_USER && !isActive) {
    res.status(200).json({
      success: false,
      field,
      message: "Admin cannot be disabled!",
    });
  } else {
    try {
      const hashedPassword = await bcryptjs.hash(password, 10);
      await connection.query(
        `UPDATE accounts SET
      password = IF(? != '', ?, password),
      email = IF(? != '', ?, email),
      isActive = ?
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

      if (!isActive) {
        res.status(200).json({
          success: true,
          field,
          message: `${username} account has been disabled.`,
        });
      } else {
        res.status(200).json({
          success: true,
          field,
          message: `${username} account has been updated.`,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        field,
        message: error.message,
        stack: error.stack,
      });
    }
  }
};
