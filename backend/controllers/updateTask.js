import { db } from "../utils/db.js";
import timeStampNotes from "../utils/timeStampNotes.js";
import jwt from "jsonwebtoken";
const updateTaskNotes = async (req, res) => {
  const { taskNotes, taskId, taskState } = req.body;
  if (taskNotes !== "") {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { username } = jwt.verify(token, process.env.JWT_SECRET);
      const stampedNotes = timeStampNotes(username, taskState, taskNotes);
      console.log("notes ", stampedNotes, "username ", username, taskId);
      await db.execute(
        "UPDATE tasks set task_notes= CONCAT(?,task_notes), task_owner=? where task_id=?;",
        [stampedNotes, username, taskId]
      );
      res.status(200).json({
        success: true,
        message: `Task ${taskId} updated`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error.",
      });
    }
  } else {
    res.status(200).json({ success: false, message: "Notes not updated" });
  }
};

const updateTaskPlan = async (req, res) => {
  const { taskPlan, taskId } = req.body;
  if (taskPlan !== "") {
    try {
      const currTaskPlan = await db
        .execute("SELECT task_plan from tasks where task_id=?;", [taskId])
        .then(([plans, fields]) => plans[0]);

      if (currTaskPlan === taskPlan) {
        res.status(200).json({
          succes: false,
          message: "Task plan not updated.",
        });
      } else {
        const token = req.headers.authorization.split(" ")[1];
        const { username } = jwt.verify(token, process.env.JWT_SECRET);

        await db.execute("UPDATE tasks set task_plan = ?, task_owner=? where task_id =?;", [
          taskPlan,
          username,
          taskId,
        ]);
        res.status(200).json({ succes: true, message: `Task ${taskId} updated.` });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error.",
      });
    }
  } else {
    res.status(200).json({ success: true });
  }
};

const updateTaskState = async (req, res) => {
  const { taskState, willPromote, taskId } = req.body;
  let newState;
  if (taskState === "Open") {
    newState = "Todo";
  } else if (taskState === "Todo") {
    newState = "Doing";
  } else if (taskState === "Doing") {
    if (willPromote) {
      newState = "Done";
    } else {
      newState = "Todo";
    }
  } else if (taskState === "Done") {
    if (willPromote) {
      newState = "Closed";
    } else {
      newState = "Doing";
    }
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { username } = jwt.verify(token, process.env.JWT_SECRET);
    await db.execute("UPDATE tasks set task_state=?, task_owner=? where task_id = ?;", [
      newState,
      username,
      taskId,
    ]);
    res.status(200).json({
      succes: true,
      message: `Task ${taskId} state has been updated`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ succes: false, message: "Internal Server Error." });
  }
};
export { updateTaskNotes, updateTaskPlan, updateTaskState };
