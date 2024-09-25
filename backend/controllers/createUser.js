const asyncConnection = require("../db");
module.exports = async (req, res, next) => {
  const { username, password, email, groups, isActive } = req.body;
  console.log(username, password, email, groups);
  try {
    const connection = await asyncConnection;
    // all fields valid
    console.log("inserting");
    await connection.query(
      `INSERT INTO  users (username, password, email, isActive) 
        VALUES ('${username}', '${password}', \'${email ? email : NULL}\', ${isActive});`
    );
    console.log("Inserted");
    // add user to groups
    if (groups.length != 0) {
      // assign user to groups
      await connection.query(
        `INSERT INTO grouplists (groupname, username) 
          VALUES ${groups.map((group) => {
            return `('` + group + `','` + username + `')`;
          })};`
      );
    }
    res.status(200).json({
      success: true,
      message: "User account created",
    });
  } catch (error) {
    console.log(error.stack);
    res.status(error.status).json({
      sucess: false,
      message: error.message,
      stack: error.stack,
    });
  }
};
