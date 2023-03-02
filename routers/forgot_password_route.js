const { get_email } = require("../middlewares/get_email");
const express = require("express");
const router = express.Router();
const {
  forgot_password,
  verify_token,
  reset_password,
} = require("../controllers/forgot_password_controller");

router.post("/forgot_password", forgot_password);

router.post("/verify-token", get_email, verify_token);

router.post("/reset-password", get_email, reset_password);
module.exports = router;
