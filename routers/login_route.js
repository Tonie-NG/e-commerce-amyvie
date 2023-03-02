const { get_email } = require("../middlewares/get_email");
const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/login_contoller");

router.post("/login", login);

router.get("/logout", logout);

module.exports = router;
