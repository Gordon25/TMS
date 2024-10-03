export default (req, res, next) => {
  const passwordRegex = new RegExp(
    "^(?=.*[a-zA-Z0-9])(?=.*\\d)(?=.*[\\W_])(?!.*[\\s])[A-Za-z\\d\\W_]{8,10}$"
  );
  const { username, password, email } = req.body;
  const isValidPassword = passwordRegex.test(password);
  const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.com$");
  const isValidEmail = emailRegex.test(email);
  // process password
  console.log(isValidPassword, username, password);
  if (!isValidPassword && (username || password != "")) {
    res.status(200).json({
      success: false,
      message:
        "Password is must alphanumeric or does not contain at least 1 special character and betweeen 8 to 10 characters long.",
    });
  } else if (!isValidPassword && username && password === "") {
    // password not provided during user creation
    res.status(200).json({
      success: false,
      message: "Password is mandatory",
    });
  } else if (email != "" && !isValidEmail) {
    // process email
    // email provided not valid
    res.status(200).json({
      success: false,
      message: "Email must be in the form <user>@<domain>.com.",
    });
  } else {
    next();
  }
};
