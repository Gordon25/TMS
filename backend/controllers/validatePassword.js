export default (req, res, next) => {
  const { username, password } = req.body;
  const isValidPassword = verifyPasswordFormat(password);
  if ((!username && password === "") || isValidPassword) {
    // no password provided in update request or password is valid
    next();
  } else if (username && password === "") {
    //password missing in create request
    res.status(200).json({
      message: "Password is mandatory",
    });
  } else {
    // password empty
    res.status(200).json({
      message: "Password is must alphanumeric or does not contain at least 1 special character.",
    });
  }
};

function verifyPasswordFormat(password) {
  const passwordRegex = new RegExp(
    "^(?=.*[a-zA-Z0-9])(?=.*\\d)(?=.*[\\W_])(?!.*[\\s])[A-Za-z\\d\\W_]{8,10}$"
  );
  return passwordRegex.test(password);
}
