export default async (req, res, next) => {
  const field = "task name";
  const tasknameRegex = new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$");
  const { taskname } = req.body;
  const isValidTaskname = tasknameRegex.test(taskname);
  if (!isValidTaskname) {
    //username not alphanumeric
    res.status(200).json({
      success: false,
      field,
      message: "Task name is not alphanumeric.",
    });
  } else {
    //taskame valid
    next();
  }
};
