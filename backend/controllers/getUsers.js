import { db } from "../utils/db.js";
export default async (req, res) => {
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
