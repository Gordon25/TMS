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
import checkIsAdminUser from "./controllers/checkIsAdmin.js";
import app from "./app.js";

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
app.get("/groups", authLogin, authGroups("Admin"), getGroupsController);
app.post("/groups", authLogin, authGroups("Admin"), createGroupController);

// User-only route
app.get("/user", authLogin, getUserController);
app.put("/user/password", authLogin, validatePasswordController, updatePasswordController);
app.put("/user/email", authLogin, validateEmailController, updateEmailController);
app.get("/checkIsAdmin", authLogin, checkIsAdminUser); // check if user is admin

export default app;
