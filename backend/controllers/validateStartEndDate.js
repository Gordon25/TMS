export default (req, res, next) => {
  const { startDate, endDate } = req.body;
  if (startDate === "") {
    res.status(200).json({
      success: false,
      field: "start date",
      message: "Start date is mandatory.",
      ...req.body,
    });
  } else if (endDate === "") {
    res.status(200).json({
      success: false,
      field: "end date",
      message: "End date is mandatory.",
      ...req.body,
    });
  } else {
    next();
  }
};
