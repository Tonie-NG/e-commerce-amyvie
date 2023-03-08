const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/verify_jwt");
const { create } = require("../controllers/product_controller");

router.post("/create", verifyToken, create);

module.exports = router;
