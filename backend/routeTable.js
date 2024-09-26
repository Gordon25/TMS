import express from "express";
import loginController from "./controllers/login.js";
import { authUsers, authGroups } from "./controllers/auth.js";
import createUserController from "./controllers/createUser.js";
import validateUsernameController from "./controllers/validateUsername.js";
import validatePasswordController from "./controllers/validatePassword.js";
import validateEmailController from "./controllers/validateEmail.js";
import updateUserController from "./controllers/updateUser.js";
import createGroupController from "./controllers/createGroup.js";
const router = express.Router();
router.post("/login", loginController);
router.get("/TMS", authUsers, authGroups("Admin")); //add middleware to render TMS page
router.post(
  "/users",
  authUsers,
  authGroups("Admin"),
  validateUsernameController,
  validatePasswordController,
  validateEmailController,
  createUserController
);
router.put(
  "/users/:username",
  authUsers,
  authGroups("Admin"),
  validatePasswordController,
  validateEmailController,
  updateUserController
);
router.post("/groups", authUsers, authGroups("Admin"), createGroupController);
export default router;
