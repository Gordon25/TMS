import connection from "../dbconnection.js";
export default async (req, res) => {
  const { group } = req.body;
  try {
    await connection.query(
      `INSERT INTO user_groups (groupname, username)
      VALUES ('${group}', NULL);`
    );
    res.status(200).json({
      success: true,
      message: "Group created successfully.",
    });
  } catch (error) {
    console.log(error.stack);
    res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }
};
