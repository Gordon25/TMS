import bcryptjs from "bcryptjs";
import { db } from "../utils/db.js";
import checkgroup from "../utils/checkgroup.js";
import timeStampNotes from "../utils/timeStampNotes.js";
const createtaskMicroservice = async (req, res) => {
  const url = req.originalUrl;
  const matchAdditionalInfoRegex = new RegExp(
    "(?<=/[Cc][Rr][Ee][Aa][Tt][Ee][Tt][Aa][Ss][Kk]).*[\\&\\?\\-\\'\\~\\%]+"
  );
  const isContainsAdditionalInfo = matchAdditionalInfoRegex.test(url);
  if (isContainsAdditionalInfo) {
    return res.json({
      code: "A001",
    });
  }
  if (
    req.headers["content-type"] !== "application/json" ||
    typeof req.body !== "object" ||
    Array.isArray(req.body)
  ) {
    return res.json({
      code: "B001",
    });
  }
  const mandatoryFields = ["username", "password", "task_app_acronym", "task_name"];
  const isMandatoryFieldsMissing =
    mandatoryFields.filter((field) => !(field in req.body)).length > 0;
  if (isMandatoryFieldsMissing) {
    return res.json({
      code: "B002",
    });
  }
  const loginUsername = req.body.username;
  const loginPassword = req.body.password;
  const appAcronym = req.body.task_app_acronym;
  try {
    const [users, fields] = await db.execute(`select * from accounts where username=?;`, [
      loginUsername,
    ]);
    if (users.length === 0) {
      return res.json({
        code: "C001",
      });
    }
    // username matches a user
    const [user] = users;
    if (typeof loginPassword !== "string") {
      return res.json({
        code: "C001",
      });
    }
    const isPasswordMatch = await bcryptjs.compare(loginPassword, user.password);
    if (!isPasswordMatch || !user.isActive) {
      return res.json({
        code: "C001",
      });
    }

    const apps = await db
      .execute(`select * from applications where app_acronym=?;`, [appAcronym])
      .then(([apps, field]) => apps);
    if (apps.length === 0) {
      // not an existing app
      return res.json({
        code: "D001",
      });
    }
    let isPermitCreate = false;
    await checkgroup(loginUsername, apps[0].app_permit_create).then((res) => {
      if (!res.message) {
        isPermitCreate = res.isUserInGroup;
      } else {
        console.log(res.message);
      }
    });
    if (!isPermitCreate) {
      return res.json({
        code: "C003",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      code: "E004",
    });
  }
  const tasknameRegex = new RegExp("^[a-zA-Z0-9]+([a-zA-Z0-9]+)*$");
  const taskname = req.body.task_name;
  const isValidTaskname = tasknameRegex.test(taskname);
  if (taskname.length > 50 || !isValidTaskname) {
    return res.json({ code: "D001" });
  }
  const taskCreator = req.body.username;
  const taskDescription = req.body.task_description || "";
  if (typeof taskDescription !== "string" || taskDescription.length > 255) {
    return res.json({
      code: "D001",
    });
  }
  const taskNotes = req.body.task_notes || "";
  if (typeof taskNotes !== "string") {
    return res.json({
      code: "D001",
    });
  }
  const taskPlan = req.body.task_plan || "";
  if (taskPlan !== "") {
    const plans = await db
      .execute(`select * from plans where plan_app_acronym=? and plan_mvp_name=?;`, [
        appAcronym,
        taskPlan,
      ])
      .then(([plans, fields]) => plans);

    const isValidTaskPlan = plans.length > 0;
    if (!isValidTaskPlan) {
      console.log(taskPlan, " not valid plans but matching plans ", plans, plans.length);
      return res.json({
        code: "D001",
      });
    }
  }
  const taskOwner = req.body.username;
  const taskState = "-";
  const createNotes = "Task created";
  const timeStampedCreateNotes = timeStampNotes(taskCreator, taskState, createNotes);
  const timeStampedNotes = timeStampNotes(taskCreator, taskState, taskNotes);
  const now = new Date();
  const createDate = now.toISOString().split("T")[0];
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      `UPDATE applications set app_rnumber=app_rnumber + 1 where app_acronym=?`,
      [appAcronym]
    );
    const [[{ taskId }]] = await connection.execute(
      `SELECT CONCAT(app_acronym, '_', app_rnumber) AS taskId FROM applications WHERE app_acronym = ?;`,
      [appAcronym]
    );

    await connection.execute(
      `INSERT INTO tasks (task_id, task_name, task_description, task_notes, task_plan, task_app_acronym, task_state, task_creator, task_owner, task_createdate)
        VALUES(?,?,?,?,?,?,?,?,?,?);`,
      [
        taskId,
        taskname,
        taskDescription,
        timeStampedNotes + timeStampedCreateNotes,
        taskPlan,
        appAcronym,
        "Open",
        taskCreator,
        taskOwner,
        createDate,
      ]
    );

    await connection.commit();
    return res.status(200).json({
      task_id: taskId,
      code: "S000",
    });
  } catch (error) {
    await connection.rollback();
    console.log(error);
    return res.json({
      code: "E004",
    });
  } finally {
    connection.release();
  }
};

/**
 * create task:
 *  - validate url done? /createTask, contains special char
 *  - validate body structure done all mandatory fields present, body not json, at least 1 field missing
 *  - validate username done valid username, "", wrong username
 *  - validate password done valid password, "", wrong password
 *  - validate user group done user in group, not in group
 *  - validate task app acronym done before IAM checks existing, not existing
 *  - validate task name done alphanumeric, not-alphanumeric, <=50, >50
 *  - validate task description done <=255, >= 256
 *  - validate task note done "" or non-empty, missing, > 50
 *  - validate task plan done "", missing, existing plan, not existing plan
 *  - create task done
 *  -- increment app rnumber done
 *  -- rollback if fail done
 *  - send {taskid, code} done
 * check for repeated fields
 */
export { createtaskMicroservice };
