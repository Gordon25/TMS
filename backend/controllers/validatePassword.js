module.exports = (req, res, next) => {
  const { password } = req.body;
  const isValidPassword = verifyPasswordFormat(password);
  if (!isValidPassword) {
    res.status(200).json({
      message: "Password is not alphanumeric or does not contain at least 1 special character.",
    });
  } else {
    next();
  }
};

function verifyPasswordFormat(password) {
  const passwordRegex = new RegExp(
    "^(?=.*[a-zA-Z0-9])(?=.*\\d)(?=.*[\\W_])(?!.*[\\s])[A-Za-z\\d\\W_]{8,10}$"
  );
  return passwordRegex.test(password);
}
