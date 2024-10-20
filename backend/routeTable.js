import loginController from "./controllers/login.js";
import { authLogin, authGroups } from "./middleware/auth.js";
import createUserController from "./controllers/createUser.js";
import validateUsernameController from "./middleware/validateUsername.js";
import {
  validatePasswordController,
  validateEmailController,
} from "./middleware/validatePasswordAndEmail.js";
import {
  updatePasswordController,
  updateEmailController,
} from "./controllers/updateUserCredentials.js";
import adminUpdateUserController from "./controllers/adminUpdateUser.js";
import createGroupController from "./controllers/createGroup.js";
import getUsersController from "./controllers/getUsers.js";
import getUserController from "./controllers/getUser.js";
import logoutController from "./controllers/logout.js";
import getGroupsController from "./controllers/getGroups.js";
import checkIsUserInGroup from "./controllers/checkIsInGroup.js";
import app from "./app.js";
import getAppsController from "./controllers/getApps.js";
import validateAppAcronymController from "./middleware/validateAppAcronym.js";
import createAppController from "./controllers/createApp.js";
import validateStartEndDateController from "./middleware/validateStartEndDate.js";
import validateGroupsController from "./middleware/validateGroups.js";
import getPlansController from "./controllers/getPlans.js";
import validatePlanNameController from "./middleware/validatePlanName.js";
import createPlanController from "./controllers/createPlan.js";
import getAppController from "./controllers/getApp.js";
import validateTaskNameController from "./middleware/validateTaskName.js";
import { authTaskAction, authCreateTask } from "./middleware/authTaskAction.js";
import createTaskController from "./controllers/createTask.js";
import getTasksController from "./controllers/getTasks.js";
import getTaskPermissionsController from "./controllers/getTaskPermissions.js";
import getTaskController from "./controllers/getTask.js";
import { updateTaskNotes, updateTaskPlan, updateTaskState } from "./controllers/updateTask.js";
// login, logout
app.post("/login", loginController);
app.get("/logout", logoutController);

// Admin-only route
// Manage Users
app.get("/users", authLogin, authGroups("Admin"), getUsersController);
app.post(
  "/users",
  authLogin,
  authGroups("Admin"),
  validateUsernameController,
  validatePasswordController,
  validateEmailController,
  createUserController
);
app.put(
  "/users/:username",
  authLogin,
  authGroups("Admin"),
  validatePasswordController,
  validateEmailController,
  adminUpdateUserController
);

// Get, Create Groups
app.get(
  "/groups",
  authLogin,
  // authGroups("Admin", "PL"),
  getGroupsController
);
app.post("/groups", authLogin, authGroups("Admin"), createGroupController);

// User-only route
app.get("/user", authLogin, getUserController);
app.put("/user/password", authLogin, validatePasswordController, updatePasswordController);
app.put("/user/email", authLogin, validateEmailController, updateEmailController);

// check user roles
app.get("/checkIsAdmin", authLogin, checkIsUserInGroup("Admin")); // check if user is admin
app.get("/checkIsPL", authLogin, checkIsUserInGroup("PL"));
app.get("/checkIsPM", authLogin, checkIsUserInGroup("PM"));

//Task Management System
//Apps
app.get("/apps", authLogin, getAppsController);
app.post("/app", authLogin, getAppController); //get single app
app.post(
  "/apps",
  authLogin,
  authGroups("PL"),
  validateAppAcronymController,
  validateStartEndDateController,
  validateGroupsController,
  createAppController
);

//Plans
app.post("/appPlans", authLogin, getPlansController); //get plans for 1 app
app.post(
  "/plans",
  authLogin,
  authGroups("PM"),
  validatePlanNameController,
  validateStartEndDateController,
  createPlanController
);

//Tasks
app.post("/appTasks", authLogin, getTasksController);
app.post("/tasks", authLogin, authCreateTask, validateTaskNameController, createTaskController);
app.post("/task", authLogin, getTaskController);

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
export default app;
