import connection from "../dbconnection.js";
export default async (req, res) => {
  const { group } = req.body;
  try {
    const [groupsMatched, fields] = await connection.query(
      `SELECT 1 FROM user_groups 
      WHERE groupname = ?`,
      group
    );
    if (groupsMatched.length > 0) {
      //is duplicate group
      res.status(400).json({
        success: false,
        message: "Duplicate group names not allowed.",
      });
    } else {
      await connection.query(
        `INSERT INTO user_groups (groupname, username)
      VALUES (?, NULL);`,
        group
      );
      res.status(200).json({
        success: true,
        message: "Group created successfully.",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};
