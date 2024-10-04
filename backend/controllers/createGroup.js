import connection from "../utils/dbconnection.js";
export default async (req, res) => {
  const { groupname } = req.body;
  const groupnameRegex = new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$");
  const isValidGroupname = groupnameRegex.test(groupname);
  if (!isValidGroupname) {
    //groupname not alphanumeric
    res.status(400).json({
      success: false,
      message: "Groupname is not alphanumeric.",
    });
  } else {
    try {
      const [groupsMatched, fields] = await connection.query(
        `SELECT 1 FROM user_groups 
      WHERE groupname = ?`,
        groupname
      );
      if (groupsMatched.length > 0) {
        //is duplicate group
        res.status(400).json({
          success: false,
          message: "Duplicate group names not allowed.",
        });
      } else {
        console.log("GROUP ", groupname);
        await connection.query(
          `INSERT INTO user_groups (groupname)
      VALUES (?);`,
          groupname
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
  }
};
