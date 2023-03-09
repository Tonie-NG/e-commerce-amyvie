const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verify_jwt");

const { create_order } = require("../controllers/order_controller");

router.post("/", verifyToken, create_order);

module.exports = router;
