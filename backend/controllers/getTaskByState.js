import bcryptjs from "bcryptjs";
import { db } from "../utils/db.js";
const getTaskByStateMicroservice = async (req, res) => {
  const url = req.originalUrl;
  const matchAdditionalInfoRegex = new RegExp(
    "(?<=/[Gg][Ee][Tt][Tt][Aa][Ss][Kk][Bb][Yy][Ss][Tt][Aa][Tt][Ee]).*[\\&\\?\\-\\'\\~\\%]+"
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
  const mandatoryFields = ["username", "password", "task_app_acronym", "task_state"];
  const isMandatoryFieldsMissing =
    mandatoryFields.filter((field) => !(field in req.body)).length > 0;
  if (isMandatoryFieldsMissing) {
    return res.json({
      code: "B002",
    });
  }
  if (typeof req.body.username !== "string") {
    return res.json({
      code: "C001",
    });
  }
  const loginUsername = req.body.username;

  try {
    const [users, fields] = await db.execute(`select * from accounts where username = ?`, [
      loginUsername,
    ]);
    if (users.length === 0) {
      return res.json({
        code: "C001",
      });
    }
    if (typeof req.body.password !== "string") {
      return res.json({
        code: "C001",
      });
    }

    const loginPassword = req.body.password;
    // username matches a user
    const [user] = users;
    const isPasswordMatch = await bcryptjs.compare(loginPassword, user.password);
    if (!isPasswordMatch || !user.isActive) {
      return res.json({
        code: "C001",
      });
    }
    if (typeof req.body.task_app_acronym !== "string") {
      return res.json({
        code: "D001",
      });
    }
    const appAcronym = req.body.task_app_acronym;
    const isExistingApp = await db
      .execute(`select * from applications where app_acronym=?;`, [appAcronym])
      .then(([apps, field]) => apps.length > 0);
    if (!isExistingApp) {
      // not an existing app
      return res.json({
        code: "D001",
      });
    }
    if (typeof req.body.task_state !== "string") {
      return res.json({
        code: "D001",
      });
    }
    const taskState = req.body.task_state;
    const validStates = ["open", "todo", "doing", "done", "closed"];
    if (!validStates.includes(taskState.toLowerCase())) {
      return res.json({
        code: "D001",
      });
    }
    const tasks = await db
      .execute(
        `select task_id, task_name, task_owner,
        coalesce((select plan_colour from plans
	      where plans.plan_mvp_name=tasks.task_plan and tasks.task_app_acronym=plans.plan_app_acronym),"") as task_plan_colour
        from tasks 
        where task_app_acronym=? and task_state=?;`,
        [appAcronym, taskState]
      )
      .then(([tasks, fields]) => tasks);
    return res.json({
      tasks,
      code: "S000",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      code: "E004",
    });
  }
};

/**
 *  * get task by state:
 *  - validate url done
 *  - validate body structure done
 *  - validate username done
 *  - validate password done
 *  - validate app acronym done
 *  - validate task state done
 *  - get task done
 *  - send {array of tasks,code} done
 *
 */
export { getTaskByStateMicroservice };
