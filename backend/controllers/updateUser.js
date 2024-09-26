import connection from "../dbconnection.js";
export default async (req, res) => {
  const username = req.params.username;
  const { password, email, groups } = req.body;
  console.log(password, email, groups);
  try {
    // update email, password
    await connection.query(
      `UPDATE users SET
      password = IF('${password}' != '', '${password}', password),
      email = IF('${email}' != '', '${email}', email)
      where username = '${username}';`
    );
    // remove unselected groups
    await connection.query(
      `DELETE FROM user_groups
      WHERE username = '${username}';`
    );

    // assign user to groups selected
    if (groups.length > 0) {
      const newEntries = groups.map(() => "(?, ?)").join(", ");
      const values = groups.flatMap((group) => [group, username]);

      await connection.query(
        `INSERT IGNORE INTO user_groups (groupname, username) VALUES ${newEntries};`,
        values
      );
    }

    res.status(200).json({
      success: true,
      message: "User update successful",
    });
  } catch (error) {
    console.log(error.stack);
    res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }
};
