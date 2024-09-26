import express from "express";
import loginController from "./controllers/login.js";
import { authLogin, authGroups, authUser } from "./controllers/auth.js";
import createUserController from "./controllers/createUser.js";
import validateUsernameController from "./controllers/validateUsername.js";
import validatePasswordController from "./controllers/validatePassword.js";
import validateEmailController from "./controllers/validateEmail.js";
import updateUserController from "./controllers/updateUser.js";
import createGroupController from "./controllers/createGroup.js";
import getUsersController from "./controllers/getUsers.js";
import getUserController from "./controllers/getUser.js";
import getUsers from "./controllers/getUsers.js";
import logoutController from "./controllers/logout.js";
const router = express.Router();
router.post("/login", loginController);
router.get("/TMS", authLogin, authGroups("Admin")); //add middleware to render TMS page
router.post(
  "/users",
  authLogin,
  authGroups("Admin"),
  validateUsernameController,
  validatePasswordController,
  validateEmailController,
  createUserController
);
router.put(
  "/users/:username",
  authLogin,
  authGroups("Admin"),
  validatePasswordController,
  validateEmailController,
  updateUserController
);
router.post("/groups", authLogin, authGroups("Admin"), createGroupController);
router.get("/users", authLogin, authGroups("Admin"), getUsersController);
router.get("/users/:username", authLogin, authUser, getUserController);
router.get("/logout", authUsers, logoutController);
export default router;
