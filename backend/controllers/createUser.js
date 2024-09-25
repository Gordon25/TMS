const asyncConnection = require("../db");
module.exports = async (req, res, next) => {
  const { username, password, email, groups, isActive } = req.body;
  console.log(username, password, email, groups);
  try {
    const connection = await asyncConnection;

    const isValidUsername = verifyUsernameFormat(username);
    let hasInvalidFields = false;
    if (!isValidUsername) {
      hasInvalidFields = true;
      console.log("invalid username");
      //username not alphanumeric
      res.json.invalidUsername = "Username is not alphanumeric.";
    } else {
      const [matchedUsernames, fields] = await connection.query(
        `select username from users where username='${username}';`
      );
      console.log(matchedUsernames, matchedUsernames.length == 0);
      if (matchedUsernames.length != 0) {
        hasInvalidFields = true;
        console.log("duplicate username");
        //duplicate username
        res.json.duplicateUsername = `${username} has already been taken, choose another one.`;
      }
    }
    const isValidPassword = verifyPasswordFormat(password);
    if (!isValidPassword) {
      hasInvalidFields = true;
      console.log("invalid password");
      res.json.invalidPassword =
        "Password is not alphanumeric or does not contain at least 1 special character.";
    }

    if (email) {
      isValidEmail = verifyEmailFormat(email);
      if (!isValidEmail) {
        hasInvalidFields = true;
        console.log("invalid email");
        res.json.invalidEmail = "Email must be in the form <user>@<domain>.com.";
      }
    }
    console.log("finished checks", hasInvalidFields);
    if (hasInvalidFields) {
      res.json.success = false;
      res.status(400).json({
        success: false,
        message: "Contains invalid fields",
      });
    } else {
      // all fields valid
      // create new user
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
    }
  } catch (error) {
    console.log(error.stack);
    res.status(error.status).json({
      sucess: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

function verifyUsernameFormat(username) {
  const usernameRegex = new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$");
  return usernameRegex.test(username);
}

function verifyPasswordFormat(password) {
  const passwordRegex = new RegExp(
    "^(?=.*[a-zA-Z0-9])(?=.*\\d)(?=.*[\\W_])(?!.*[\\s])[A-Za-z\\d\\W_]{8,10}$"
  );
  return passwordRegex.test(password);
}

function verifyEmailFormat(email) {
  const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.com$");
  return emailRegex.test(email);
}
