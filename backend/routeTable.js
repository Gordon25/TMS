const express = require("express");
const router = express.Router();
const loginController = require("./controllers/login");
const { authUsers, authGroups } = require("./controllers/auth");
router.post("/login", loginController);
router.get("/TMS", authUsers, authGroups("Admin"));

module.exports = router;
