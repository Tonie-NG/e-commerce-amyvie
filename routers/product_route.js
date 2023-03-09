const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verify_jwt");
const {
  create_product,
  delete_product,
  get_product,
  get_products,
  update_product,
} = require("../controllers/product_controller");

router.post("/create", verifyTokenAndAdmin, create_product);
router.get("/:id", verifyToken, get_product);
router.get("/", get_products);
router.put("/:id", verifyTokenAndAdmin, update_product);
router.delete("/:id", verifyTokenAndAdmin, delete_product);

module.exports = router;
