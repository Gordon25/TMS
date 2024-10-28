import { db } from "../utils/db.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
const createUser = async (req, res) => {
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

const getUser = async (req, res) => {
  const token = req.cookies.token;
  try {
    const { username } = jwt.verify(token, process.env.JWT_SECRET);
    const [[user], Fields] = await db.execute(
      `SELECT username, email FROM accounts WHERE username=?;`,
      [username]
    );
    const data = { ...user };
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const [users, userFields] = await db.execute(
      `SELECT username, email, isActive FROM accounts where isActive=1;`
    );
    const [groups, groupFields] = await db.execute(`SELECT username, groupname FROM user_groups;`);
    const data = users.map((user) => {
      return {
        ...user,
        email: user.email == null ? "" : user.email,
        groups: groups
          .filter((group) => group.username === user.username)
          .map((group) => group.groupname),
      };
    });
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};

const updateUser = async (req, res) => {
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

export { createUser, getUser, getUsers, updateUser };
