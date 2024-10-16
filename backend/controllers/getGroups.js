import { db } from "../utils/db.js";
export default async (req, res) => {
  try {
    const [groups, fields] = await db.execute("SELECT DISTINCT groupname FROM user_groups;");
    const groupnames = groups.map((group) => group.groupname);
    res.status(200).json({
      success: true,
      data: groupnames,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: true,
      message: "Internal Server error.",
    });
  }
};
