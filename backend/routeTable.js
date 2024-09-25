const express = require("express");
const router = express.Router();
const loginController = require("./controllers/login");
const { authUsers, authGroups } = require("./controllers/auth");
const createUserController = require("./controllers/createUser");
const assignGroupsController = require("./controllers/assignGroups");
router.post("/login", loginController);
router.get("/TMS", authUsers, authGroups("Admin")); //add middleware to render TMS page
router.post("/createUser", authUsers, authGroups("Admin"), createUserController);
module.exports = router;
