import { group } from "console";
import connection from "../dbconnection.js";
export default async (req, res) => {
  try {
    const [groups, fields] = await connection.query("SELECT DISTINCT groupname FROM user_groups;");
    const groupnames = groups.map((group) => group.groupname);
    res.status(200).json({
      success: true,
      groups: groupnames,
    });
  } catch (error) {
    res.status(error.status).json({
      success: true,
      message: error.message,
    });
  }
};
