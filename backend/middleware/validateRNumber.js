export default (req, res, next) => {
  const field = "rnumber";
  const { rNumber } = req.body;
  console.log(rNumber);
  const rNumberRegex = new RegExp(/^(0|[1-9]\d*).?$/);
  const isValidRNumber = rNumberRegex.test(rNumber);
  if (!isValidRNumber) {
    res.status(200).json({
      success: false,
      field,
      message: "R Number must be an integer greater or equals to 0 without leading 0.",
    });
  } else {
    next();
  }
};
