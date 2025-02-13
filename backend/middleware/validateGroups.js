export default (req, res, next) => {
  const { create, open, todo, doing, done } = req.body;
  if (!create) {
    res.status(200).json({
      success: false,
      field: "create",
      message: "Create Group cannot be empty.",
    });
  } else if (!open) {
    res.status(200).json({
      success: false,
      field: "open",
      message: "Open Group cannot be empty.",
    });
  } else if (!todo) {
    res.status(200).json({
      success: false,
      field: "todo",
      message: "Todo Group cannot be empty.",
    });
  } else if (!doing) {
    res.status(200).json({
      success: false,
      field: "doing",
      message: "Doing Group cannot be empty.",
    });
  } else if (!done) {
    res.status(200).json({
      success: false,
      field: "done",
      message: "Done Group cannot be empty.",
    });
  } else {
    next();
  }
};
