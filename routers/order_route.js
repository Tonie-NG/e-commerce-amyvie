const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verify_jwt");

const {
  create_order,
  get_orders,
  get_order,
  update_order,
  delete_order,
} = require("../controllers/order_controller");

router.post("/", verifyToken, create_order);
router.get("/", verifyTokenAndAdmin, get_orders);
router.get("/:id", verifyTokenAndAuthorization, get_order);
// router.put("/:id", verifyTokenAndAuthorization, update_order); might not be a good functionality as this ca lead to seaveral vuneralbility and security issues.
router.delete("/:id", verifyTokenAndAuthorization, delete_order);

module.exports = router;
