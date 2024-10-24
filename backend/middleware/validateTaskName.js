export default async (req, res, next) => {
  const field = "task name";
  const tasknameRegex = new RegExp("^[a-zA-Z0-9]+([a-zA-Z0-9]+)*$");
  const { taskname, taskPlan, taskDescription, taskNotes } = req.body;
  const isValidTaskname = tasknameRegex.test(taskname);
  if (!isValidTaskname) {
    //username not alphanumeric
    res.status(200).json({
      success: false,
      field,
      message: "Task name is not alphanumeric.",
      taskname,
      taskPlan,
      taskDescription,
      taskNotes,
    });
  } else {
    //taskame valid
    next();
  }
};
