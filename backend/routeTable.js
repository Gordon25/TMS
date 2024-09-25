const express = require("express");
const router = express.Router();
const loginController = require("./controllers/login");
const { authUsers, authGroups } = require("./controllers/auth");
const createUserController = require("./controllers/createUser");
const validateUsernameController = require("./controllers/validateUsername");
const validatePasswordController = require("./controllers/validatePassword");
const validateEmailController = require("./controllers/validateEmail");
const updateUserController = require("./controllers/updateUser");
router.post("/login", loginController);
router.get("/TMS", authUsers, authGroups("Admin")); //add middleware to render TMS page
router.post(
  "/createUser",
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
module.exports = router;
