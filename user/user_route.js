const { get_email } = require("../middlewares/get_email");
const express = require("express");
const router = express.Router();
const {
  register,
  verify,
  get_details,
  get_password,
  login,
  logout,
  forgot_password,
  verify_token,
  reset_password,
} = require("./user_controller");

router.post("/register", register);

router.post("/verify", verify);

router.post("/register/details", get_email, get_details);

router.post("/register/password", get_email, get_password);

router.post("/login", login);

router.get("/logout", logout);

router.post("/forgot_password", forgot_password);

router.post("/verify-token", get_email, verify_token);

router.post("/reset-password", get_email, reset_password);
module.exports = router;
