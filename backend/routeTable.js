import express from "express";
import loginController from "./controllers/login.js";
import { authLogin, authGroups, authUser } from "./controllers/auth.js";
import createUserController from "./controllers/createUser.js";
import validateUsernameController from "./controllers/validateUsername.js";
import validatePasswordAndEmailController from "./controllers/validatePasswordAndEmail.js";

import updateUserController from "./controllers/updateUser.js";
import createGroupController from "./controllers/createGroup.js";
import getUsersController from "./controllers/getUsers.js";
import getUserController from "./controllers/getUser.js";
import logoutController from "./controllers/logout.js";
import getGroupsController from "./controllers/getGroups.js";
import app from "./app.js";

// login, logout
app.post("/login", loginController);
app.get("/logout", authLogin, logoutController);

// Users
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
app.get("/:username", authLogin, authUser, getUserController);
app.put("/:username", authLogin, authUser, updateUserController);

// Groups
app.get("/groups", authLogin, authGroups("Admin"), getGroupsController);
app.post("/groups", authLogin, authGroups("Admin"), createGroupController);

app.get("/TMS", authLogin, authGroups("Admin")); //add middleware to render TMS page

app.get("/", (req, res) => {
  res.json({ message: "Hi, youve reached the backend" });
});
export default app;
