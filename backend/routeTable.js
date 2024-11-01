import loginController from "./controllers/login.js";
import { authLogin, authGroups } from "./middleware/auth.js";
import { createUser, getUser, getUsers, updateUser } from "./controllers/User.js";
import validateUsernameController from "./middleware/validateUsername.js";
import {
  validatePasswordController,
  validateEmailController,
} from "./middleware/validatePasswordAndEmail.js";
import {
  updatePasswordController,
  updateEmailController,
} from "./controllers/updateUserCredentials.js";
import { getGroups, createGroup } from "./controllers/Group.js";
import logoutController from "./controllers/logout.js";
import checkIsUserInGroup from "./controllers/checkIsInGroup.js";
import app from "./app.js";
import validateAppAcronymController from "./middleware/validateAppAcronym.js";
import { createApp, updateApp, getApps } from "./controllers/App.js";
import validateStartEndDateController from "./middleware/validateStartEndDate.js";
import validatePlanNameController from "./middleware/validatePlanName.js";
import { createPlan, getPlans } from "./controllers/Plan.js";
import validateTaskNameController from "./middleware/validateTaskName.js";
import { authTaskAction, authCreateTask } from "./middleware/authTaskAction.js";
import getTaskPermissionsController from "./controllers/getTaskPermissions.js";
import {
  updateTaskNotes,
  updateTaskPlan,
  updateTaskState,
  createTask,
  getTask,
  getTasks,
} from "./controllers/Task.js";
import validateRNumber from "./middleware/validateRNumber.js";
import { createtaskMicroservice } from "./controllers/createTask.js";
import { getTaskByStateMicroservice } from "./controllers/getTaskbyState.js";
import { promoteTask2DoneMicroservice } from "./controllers/promoteTask2Done.js";
// login, logout
app.post("/login", loginController);
app.get("/logout", logoutController);

// Admin-only route
// Manage Users
app.get("/users", authLogin, authGroups("Admin"), getUsers);
app.post(
  "/users",
  authLogin,
  authGroups("Admin"),
  validateUsernameController,
  validatePasswordController,
  validateEmailController,
  createUser
);
app.put(
  "/users/:username",
  authLogin,
  authGroups("Admin"),
  validatePasswordController,
  validateEmailController,
  updateUser
);

// Get, Create Groups
app.get(
  "/groups",
  authLogin,
  // authGroups("Admin", "PL"),
  getGroups
);
app.post("/groups", authLogin, authGroups("Admin"), createGroup);

// User-only route
app.get("/user", authLogin, getUser);
app.put("/user/password", authLogin, validatePasswordController, updatePasswordController);
app.put("/user/email", authLogin, validateEmailController, updateEmailController);

// check user roles
app.get("/checkIsAdmin", authLogin, checkIsUserInGroup("Admin")); // check if user is admin
app.get("/checkIsPL", authLogin, checkIsUserInGroup("PL"));
app.get("/checkIsPM", authLogin, checkIsUserInGroup("PM"));

//Task Management System
//Apps
app.get("/apps", authLogin, getApps);
app.post(
  "/apps",
  authLogin,
  authGroups("PL"),
  validateAppAcronymController,
  validateRNumber,
  validateStartEndDateController,
  createApp
);
app.put("/apps", authLogin, authGroups("PL"), validateStartEndDateController, updateApp);

//Plans
app.post("/appPlans", authLogin, getPlans); //get plans for 1 app
app.post(
  "/plans",
  authLogin,
  authGroups("PM"),
  validatePlanNameController,
  validateStartEndDateController,
  createPlan
);

//Tasks
app.post("/appTasks", authLogin, getTasks);
app.post("/tasks", authLogin, authCreateTask, validateTaskNameController, createTask);
app.post("/task", authLogin, getTask);

//update task notes
app.put("/taskNotes", authLogin, authTaskAction, updateTaskNotes);

//update task plan
app.put("/updateReleaseTaskPlan", authLogin, authTaskAction, updateTaskPlan);
app.put("/updateDoneTaskPlan", authLogin, authTaskAction, updateTaskPlan);

//update task state
app.put("/updateOpenTaskState", authLogin, authTaskAction, updateTaskState);
app.put("/updateTodoTaskState", authLogin, authTaskAction, updateTaskState);
app.put("/updateDoingTaskState", authLogin, authTaskAction, updateTaskState);
app.put("/updateDoneTask", authLogin, authTaskAction, updateTaskState);
//Task Permissions
app.post("/taskPermissions", authLogin, getTaskPermissionsController);

//Assignment 3, microservices
app.post("/createtask", createtaskMicroservice);
app.post("/gettaskbystate", getTaskByStateMicroservice);
app.patch("/promotetask2done", promoteTask2DoneMicroservice);
app.use((req, res) => {
  res.json({
    code: "A001",
  });
});
export default app;
