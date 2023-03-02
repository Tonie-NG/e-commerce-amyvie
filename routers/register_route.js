const { get_email } = require("../middlewares/get_email");
const express = require("express");
const router = express.Router();
const {
  register,
  verify,
  get_details,
  get_password,
} = require("../controllers/register_controller");

router.post("/register", register);

router.post("/verify", verify);

router.post("/register/details", get_email, get_details);

router.post("/register/password", get_email, get_password);

module.exports = router;
