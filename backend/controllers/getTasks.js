import { db } from "../utils/db.js";
export default async (req, res) => {
  const { appAcronym } = req.body;
  // const defaultPlanColour = "#FFFFFF";
  let open = [],
    todo = [],
    doing = [],
    done = [],
    closed = [];
  try {
    const tasks = await db
      .execute(
        `select task_id, task_name, task_owner, task_state,
        (select plan_colour from plans
	      where plans.plan_mvp_name=tasks.task_plan and tasks.task_app_acronym=plans.plan_app_acronym) as plan_colour
        from tasks 
        where task_app_acronym=?;`,
        [appAcronym]
      )
      .then(([tasks, fields]) => tasks);
    open = tasks.filter((task) => task.task_state === "Open");
    todo = tasks.filter((task) => task.task_state === "Todo");
    doing = tasks.filter((task) => task.task_state === "Doing");
    done = tasks.filter((task) => task.task_state === "Done");
    closed = tasks.filter((task) => task.task_state === "Closed");
    res.status(200).json({
      success: true,
      open,
      todo,
      doing,
      done,
      closed,
    });
  } catch (error) {
    res.json(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
