import loginController from "./controllers/login.js";
import { authLogin, authGroups } from "./controllers/auth.js";
import createUserController from "./controllers/createUser.js";
import validateUsernameController from "./controllers/validateUsername.js";
import validatePasswordAndEmailController from "./controllers/validatePasswordAndEmail.js";

import updateUserController from "./controllers/updateUser.js";
import createGroupController from "./controllers/createGroup.js";
import getUsersController from "./controllers/getUsers.js";
import getUserController from "./controllers/getUser.js";
import logoutController from "./controllers/logout.js";
import getGroupsController from "./controllers/getGroups.js";
import checkIsAdminUser from "./controllers/checkIsAdmin.js";
import app from "./app.js";

// login, logout
app.post("/login", loginController);
app.get("/logout", authLogin, logoutController);

// Admin-only route
// Manage Users
app.get("/users", authLogin, authGroups("Admin"), getUsersController);
app.post(
  "/users",
  authLogin,
  authGroups("Admin"),
  validateUsernameController,
  validatePasswordAndEmailController,
  createUserController
);
app.put(
  "/users/:username",
  authLogin,
  authGroups("Admin"),
  validatePasswordAndEmailController,
  updateUserController
);

// Get, Create Groups
app.get("/groups", authLogin, authGroups("Admin"), getGroupsController);
app.post("/groups", authLogin, authGroups("Admin"), createGroupController);

// User-only route
app.get("/user", authLogin, getUserController);
app.put("/user", authLogin, validatePasswordAndEmailController, updateUserController);

app.get("/checkIsAdmin", authLogin, checkIsAdminUser); // check if user is admin

export default app;
