import loginController from "./controllers/login.js";
import { authLogin, authGroups } from "./controllers/auth.js";
import createUserController from "./controllers/createUser.js";
import validateUsernameController from "./controllers/validateUsername.js";
import {
  validatePasswordController,
  validateEmailController,
} from "./controllers/validatePasswordAndEmail.js";
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
import validateAppAcronymController from "./controllers/validateAppAcronym.js";
import createAppController from "./controllers/createApp.js";
import validateStartEndDateController from "./controllers/validateStartEndDate.js";
import validateGroupsController from "./controllers/validateGroups.js";
import getPlansController from "./controllers/getPlans.js";
import validatePlanNameController from "./controllers/validatePlanName.js";
import createPlanController from "./controllers/createPlan.js";
import getAppController from "./controllers/getApp.js";
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

app.post("/appPlans", authLogin, getPlansController); //get plans for 1 app
app.post(
  "/plans",
  authLogin,
  authGroups("PM"),
  validatePlanNameController,
  validateStartEndDateController,
  createPlanController
);

export default app;
