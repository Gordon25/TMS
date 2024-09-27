import { group } from "console";
import connection from "../dbconnection.js";
export default async (req, res) => {
  try {
    const [groups, fields] = await connection.query("SELECT DISTINCT groupname FROM user_groups;");
    const groupnames = groups.map((group) => group.groupname);
    res.status(200).json({
      success: true,
      data: groupnames,
    });
  } catch (error) {
    res.json({
      success: true,
      message: error.message,
      stack: error.stack,
    });
  }
};
