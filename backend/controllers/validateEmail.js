export default (req, res, next) => {
  const { email } = req.body;
  if (email === "" || verifyEmailFormat(email)) {
    // email not provided or email valid
    next();
  } else {
    res.json.invalidEmail = "Email must be in the form <user>@<domain>.com.";
  }
};

function verifyEmailFormat(email) {
  const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.com$");
  return emailRegex.test(email);
}
