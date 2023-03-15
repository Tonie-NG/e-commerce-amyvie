const router = require("express").Router();
const {
  get_messages,
  get_message,
  delete_message,
} = require("../controllers/message_controller");
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middlewares/verify_jwt");

router.get("/", verifyTokenAndAdmin, get_messages);
router.get("/:id", verifyTokenAndAuthorization, get_message);
router.delete("/:id", verifyTokenAndAuthorization, delete_message);

module.exports = router;
