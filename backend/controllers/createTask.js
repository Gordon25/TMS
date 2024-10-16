import { db } from "../utils/db.js";
import timeStampNotes from "../utils/timeStampNotes.js";
export default async (req, res) => {
  const field = "task";
  const {
    taskname,
    appAcronym,
    taskPlan,
    taskState,
    taskCreator,
    taskOwner,
    taskDescription,
    taskNotes,
  } = req.body;
  const timeStampedNotes = timeStampNotes(taskNotes);
  const now = new Date();
  const createDate = now.toISOString().split("T")[0];
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const taskId = await connection.execute(
      `SELECT CONCAT(app_acronym, '_', app_rnumber) 
                                              FROM applications 
                                            WHERE app_acronym = ?;`,
      appAcronym
    );
    await connection.execute(
      `INSERT INTO tasks (task_id, task_name, task_description, task_notes, task_plan, task_app_acronym, task_state, task_creator, task_owner, task_createdate)
        VALUES(,?,?,?,?,?,?,?,?,?);`[
        (taskId,
        taskname,
        taskDescription,
        taskDescription,
        timeStampedNotes,
        taskPlan,
        appAcronym,
        taskState,
        taskCreator,
        taskOwner,
        createDate)
      ]
    );
    await connection.execute(
      `UPDATE applications set app_rnumber=app_rumber + 1 where app_acronym=?`,
      appAcronym
    );
    await connection.commit();
    res.status(200).json({
      success: true,
      field,
      message: `Task ${taskname} created successfully.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      field,
      message: "Internal Server error.",
    });
  } finally {
    connection.release();
  }
};
