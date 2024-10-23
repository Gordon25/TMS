import { db } from "../utils/db.js";
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
      await db.execute(
        `UPDATE accounts SET
      password = IF(? != '', ?, password),
      email = IF(? != '', ?, email),
      isActive = ?
      where username = ?;`,
        [password, hashedPassword, email, email, isActive, username]
      );

      // get current groups
      const currentJoinedGroups = await db
        .execute(
          `SELECT groupname from user_groups
      WHERE username = ?;`,
          [username]
        )
        .then(([groups, fields]) => groups)
        .then((groups) => groups.map((group) => group.groupname));

      // get unselected groups to be removed
      const groupsToRemove = currentJoinedGroups.filter(
        (curr_group) => !groups.includes(curr_group)
      );
      if (groupsToRemove.length > 0) {
        // Dynamically create placeholders for the number of groups to remove
        const groupsPlaceholder = groupsToRemove.map(() => "?").join(", ");

        // Create the query with the correct number of placeholders
        await db.execute(
          `DELETE FROM user_groups
        WHERE username = ? 
        AND groupname IN (${groupsPlaceholder});`,
          [username, ...groupsToRemove]
        );
      }

      // assign user to groups selected
      const groupsToAdd = groups.filter((group) => !currentJoinedGroups.includes(group));
      if (groupsToAdd.length > 0) {
        const newGroupsPlaceholder = groupsToAdd.map(() => "(?, ?)").join(", ");
        const values = groupsToAdd.flatMap((group) => [group, username]);
        await db.execute(
          `INSERT INTO user_groups (groupname, username) VALUES ${newGroupsPlaceholder};`,
          [...values]
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
      console.log(error);
      res.status(500).json({
        success: false,
        field,
        message: "Internal Server error.",
      });
    }
  }
};
