const validatePasswordController = (req, res, next) => {
  const passwordRegex = new RegExp(
    "^(?=.*[a-zA-Z0-9])(?=.*\\d)(?=.*[\\W_])(?!.*[\\s])[A-Za-z\\d\\W_]{8,10}$"
  );
  const { password } = req.body;
  const isValidPassword = passwordRegex.test(password);
  // process password
  if (isValidPassword || password === "") {
    next();
  } else {
    // password is not valid and non-empty
    res.status(200).json({
      success: false,
      field: "password",
      message:
        "Password is must alphanumeric or does not contain at least 1 special character and betweeen 8 to 10 characters long.",
    });
  }
};

const validateEmailController = (req, res, next) => {
  const { email } = req.body;
  const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.com$");
  const isValidEmail = emailRegex.test(email);
  if (isValidEmail || email == "") {
    next();
  } else {
    // process email
    // email provided not valid and non-empty
    res.status(200).json({
      success: false,
      field: "email",
      message: "Email must be in the form <user>@<domain>.com.",
    });
  }
};

export { validatePasswordController, validateEmailController };
