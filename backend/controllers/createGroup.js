import { db } from "../utils/db.js";
export default async (req, res) => {
  const field = "group";
  const { groupname } = req.body;
  const groupnameRegex = new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$");
  const isValidGroupname = groupnameRegex.test(groupname);
  if (!isValidGroupname) {
    //groupname not alphanumeric
    res.status(200).json({
      success: false,
      field,
      message: "Groupname is not alphanumeric.",
    });
  } else {
    try {
      const [groupsMatched, fields] = await db.execute(
        `SELECT 1 FROM user_groups 
      WHERE groupname = ?`,
        groupname
      );
      if (groupsMatched.length > 0) {
        //is duplicate group
        res.status(200).json({
          success: false,
          field,
          message: "Duplicate group names not allowed.",
        });
      } else {
        await db.execute(
          `INSERT INTO user_groups (groupname)
      VALUES (?);`,
          groupname
        );
        res.status(200).json({
          success: true,
          field,
          message: `Group ${groupname} created successfully.`,
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
