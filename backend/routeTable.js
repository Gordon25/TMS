const express = require("express");
const router = express.Router();
const loginController = require("./controllers/login");
const authController = require("./controllers/auth");
const { authUsers, authGroups } = require("./controllers/auth");
router.post("/login", loginController);
router.get("/TMS", authUsers, authGroups("Admin"));

module.exports = router;
