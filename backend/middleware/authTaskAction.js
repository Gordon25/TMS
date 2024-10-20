import checkgroup from "../utils/checkgroup.js";
import { db } from "../utils/db.js";
import jwt from "jsonwebtoken";

const authTaskAction = async (req, res, next) => {
  const { taskId } = req.body;
  try {
    const permittedGroup = await db
      .execute(
        `select (select case 
                when task_state = 'Open' then app_permit_open
                when task_state = 'Todo' then app_permit_todolist
                when task_state = 'Doing' then app_permit_doing
                when task_state = 'Done' then app_permit_done      
                else ''
                end 
                from applications 
                where app_acronym = task_app_acronym) as permitted_group
      from tasks 
      where task_id = ?;`,
        [taskId]
      )
      .then(([permittedGroup, fields]) => permittedGroup[0].permitted_group);
    const token = req.headers.authorization.split(" ")[1];
    const { username } = jwt.verify(token, process.env.JWT_SECRET);
    const { isUserInGroup, message } = await checkgroup(username, permittedGroup);
    if (message != "") {
      res.status(500).json({
        success: false,
        message,
      });
    } else if (!isUserInGroup) {
      res.status(200).json({
        success: false,
        message: `User not permitted to release task.`,
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
const authCreateTask = async (req, res, next) => {
  const { appAcronym } = req.body;
  try {
    const permittedGroup = await db
      .execute(`select app_permit_create from applications where app_acronym=?;`, [appAcronym])
      .then(([groups, field]) => groups[0].app_permit_create);

    const token = req.headers.authorization.split(" ")[1];
    const { username } = jwt.verify(token, process.env.JWT_SECRET);
    const { isUserInGroup, message } = await checkgroup(username, permittedGroup);
    if (message != "") {
      res.status(500).json({
        success: false,
        message,
      });
    } else if (!isUserInGroup) {
      res.status(200).json({
        success: false,
        message: `User not permitted to create task.`,
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export { authTaskAction, authCreateTask };
