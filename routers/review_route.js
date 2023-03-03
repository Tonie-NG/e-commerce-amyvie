const express = require("express");
const {
  post_review,
  update_review,
  get_review,
  get_all_reviews,
  delete_review,
} = require("../controllers/review_controller");
const {
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../middlewares/verify_jwt");
const router = express.Router();

router.post("/", verifyToken, post_review);

router.put("/:id", verifyTokenAndAuthorization, update_review);

router.get("/:id", get_review);

router.get("/", get_all_reviews);

router.delete("/:id", verifyTokenAndAuthorization, delete_review);

module.exports = router;
