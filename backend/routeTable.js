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
const router = express.Router();

// login, logout
router.post("/login", loginController);
router.get("/logout", authLogin, logoutController);

// Users
router.get("/users", authLogin, authGroups("Admin"), getUsersController);
router.post(
  "/users",
  authLogin,
  authGroups("Admin"),
  validateUsernameController,
  validatePasswordAndEmailController,
  createUserController
);
router.put(
  "/users/:username",
  authLogin,
  authGroups("Admin"),
  validatePasswordAndEmailController,
  updateUserController
);
router.get("/:username", authLogin, authUser, getUserController);
router.put("/:username", authLogin, authUser, updateUserController);

// Groups
router.get("/groups", authLogin, authGroups("Admin"), getGroupsController);
router.post("/groups", authLogin, authGroups("Admin"), createGroupController);

router.get("/TMS", authLogin, authGroups("Admin")); //add middleware to render TMS page
export default router;
