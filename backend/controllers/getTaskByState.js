import bcryptjs from "bcryptjs";
import { db } from "../utils/db.js";
const getTaskByStateMicroservice = async (req, res) => {
  const url = req.originalUrl;
  const matchAdditionalInfoRegex = new RegExp("(?<=\\/gettaskbystate)[\\&\\?\\-\\'\\~\\%]+");
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
  const loginUsername = req.body.username;
  const loginPassword = req.body.password;
  try {
    const [entries, fields] = await db.execute(`select * from accounts where username=?;`, [
      loginUsername,
    ]);
    if (entries.length === 0) {
      return res.json({
        code: "C001",
      });
    }
    // username matches a user
    const [user] = entries;
    const isPasswordMatch = await bcryptjs.compare(loginPassword, user.password);
    if (!isPasswordMatch) {
      return res.json({
        code: "C001",
      });
    }
    //check if user is disabled also
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
    const taskState = req.body.task_state.toLowerCase();
    const validStates = ["open", "todo", "doing", "done", "closed"];
    if (!validStates.includes(taskState)) {
      return res.json({
        code: "D001",
      });
    }
    const interpretedState = InterpreteState[taskState];
    const tasks = await db
      .execute(
        `select task_id, task_name, task_owner,
        coalesce((select plan_colour from plans
	      where plans.plan_mvp_name=tasks.task_plan and tasks.task_app_acronym=plans.plan_app_acronym),"") as task_plan_colour
        from tasks 
        where task_app_acronym=? and task_state=?;`,
        [appAcronym, interpretedState]
      )
      .then(([tasks, fields]) => tasks);
    return res.json({
      code: "S000",
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      code: "E004",
    });
  }
};

const InterpreteState = {
  open: "Open",
  todo: "Todo",
  doing: "Doing",
  done: "Done",
  closed: "Closed",
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
