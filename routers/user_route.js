const express = require("express");
const router = express.Router();
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middlewares/verify_jwt");
const {
  get_user,
  get_all_users,
  update_user,
  delete_user,
} = require("../controllers/user_controller");

router.get("/:id", verifyTokenAndAuthorization, get_user);

router.get("/", verifyTokenAndAdmin, get_all_users);

router.put("/:id", verifyTokenAndAuthorization, update_user);

router.delete("/:id", verifyTokenAndAuthorization, delete_user);

module.exports = router;
