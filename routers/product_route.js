const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verify_jwt");

router.post("/create", verifyToken);

module.exports = router;
