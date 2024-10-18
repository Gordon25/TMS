import checkgroup from "../utils/checkgroup.js";
import { db } from "../utils/db.js";
import jwt from "jsonwebtoken";
import { authGroups } from "./auth.js";

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

const authReleaseTask = async (req, res, next) => {
  const { taskId } = req.body;
  try {
    const permittedGroup = await db
      .execute(
        `select app_permit_open from applications 
        where app_acronym=(select task_app_acronym from tasks where task_id = ?);`,
        [taskId]
      )
      .then(([apps, fields]) => apps[0].app_permit_open);
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
    res.status(200).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

const authTodoTask = async (req, res, next) => {
  const { taskId } = req.body;
  try {
    const permittedGroup = await db
      .execute(
        `select app_permit_todolist from applications 
        where app_acronym=(select task_app_acronym from tasks where task_id = ?);`,
        [taskId]
      )
      .then(([apps, fields]) => apps[0].app_permit_todolist);
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
        message: `User not permitted to modify todo task.`,
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

const authDoingTask = async (req, res, next) => {
  const { taskId } = req.body;
  try {
    const permittedGroup = await db
      .execute(
        `select app_permit_doing from applications 
        where app_acronym=(select task_app_acronym from tasks where task_id = ?);`,
        [taskId]
      )
      .then(([apps, fields]) => apps[0].app_permit_doing);
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
        message: `User not permitted to modify doing task.`,
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
const authDoneTask = async (req, res, next) => {
  const { taskId } = req.body;
  try {
    const permittedGroup = await db
      .execute(
        `select app_permit_done from applications 
        where app_acronym=(select task_app_acronym from tasks where task_id = ?);`,
        [taskId]
      )
      .then(([apps, fields]) => apps[0].app_permit_done);
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
        message: `User not permitted to modify done task.`,
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
const authEditTaskNotes = async (req, res, next) => {
  const { taskId } = req.body;
  try {
    const permittedGroups = await db
      .execute(
        `select app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done from applications 
        where app_acronym=(select task_app_acronym from tasks where task_id = ?);`,
        [taskId]
      )
      .then(([apps, fields]) => apps[0]);
    const {
      app_permit_create,
      app_permit_open,
      app_permit_todolist,
      app_permit_doing,
      app_permit_done,
    } = permittedGroups;
    const token = req.headers.authorization.split(" ")[1];
    const { username } = jwt.verify(token, process.env.JWT_SECRET);

    req.username = username;
    return authGroups(
      app_permit_create,
      app_permit_open,
      app_permit_todolist,
      app_permit_doing,
      app_permit_done
    )(req, res, next);
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
export {
  authCreateTask,
  authReleaseTask,
  authTodoTask,
  authDoingTask,
  authDoneTask,
  authEditTaskNotes,
};
