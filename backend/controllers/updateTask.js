import { db } from "../utils/db.js";
import timeStampNotes from "../utils/timeStampNotes.js";
import jwt from "jsonwebtoken";
import transporter from "../utils/transporter.js";

const updateTaskNotes = async (req, res) => {
  const { taskNotes, taskId, taskState } = req.body;
  if (taskNotes !== "") {
    try {
      const token = req.cookies.token;
      const { username } = jwt.verify(token, process.env.JWT_SECRET);
      const stampedNotes = timeStampNotes(username, taskState, taskNotes);
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
    res.status(200).json({ success: false, message: "Notes not changed." });
  }
};

const updateTaskPlan = async (req, res) => {
  const { taskPlan, taskId } = req.body;
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
      const token = req.cookies.token;
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
};

const updateTaskState = async (req, res) => {
  const { taskState, willPromote, taskId } = req.body;
  let newState;
  let message = `${taskId} successfully promoted.`;
  if (taskState === "Open") {
    newState = "Todo";
  } else if (taskState === "Todo") {
    newState = "Doing";
  } else if (taskState === "Doing") {
    if (willPromote) {
      newState = "Done";
    } else {
      newState = "Todo";
      message = `${taskId} successfully demoted.`;
    }
  } else if (taskState === "Done") {
    if (willPromote) {
      newState = "Closed";
    } else {
      newState = "Doing";
      message = `${taskId} successfully demoted.`;
    }
  }
  try {
    if (taskState === "Doing" && willPromote) {
      const emails = await db
        .execute(
          `select email from accounts where username in 
	    (select username from user_groups where groupname = 
		    (select app_permit_done from applications where app_acronym = 
			    (select task_app_acronym from tasks where task_id = ?)));`,
          [taskId]
        )
        .then(([emails, fields]) => emails)
        .then((emails) => emails.map((email) => email.email))
        .then((emails) => emails.filter((email) => email != null));

      transporter.sendMail({
        from: `"Maddison Foo Koch " ${process.env.SMTP_FROM_EMAIL}`,
        to: emails.join(", "),
        subject: `Task ID ${taskId} pending task review.`,
        text: `This task is pending approval.`,
      });
    }
    const token = req.cookies.token;
    const { username } = jwt.verify(token, process.env.JWT_SECRET);

    let notes = `Task state changed from ${taskState} to ${newState}.`;
    let stampedNotes = timeStampNotes(username, taskState, notes);

    await db.execute(
      "UPDATE tasks set task_state=?, task_owner=?, task_notes= CONCAT(?,task_notes) where task_id = ?;",
      [newState, username, stampedNotes, taskId]
    );
    res.status(200).json({
      succes: true,
      message,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ succes: false, message: "Internal Server Error." });
  }
};
export { updateTaskNotes, updateTaskPlan, updateTaskState };
