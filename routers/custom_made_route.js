const {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verify_jwt");
const router = express.Router();
const {
  add_custom_wear,
  get_all_custom_wears,
  get_custom_wear,
  update_custom_wear,
  delete_custom_wear,
} = require("../controllers/custom_made_controller");

router.post("/", verifyToken, add_custom_wear);
router.get("", verifyTokenAndAdmin, get_all_custom_wears);
router.get("/:id", verifyToken, get_custom_wear);
router.put("/:id", verifyTokenAndAuthorization, update_custom_wear);
router.delete("/:id", verifyTokenAndAuthorization, delete_custom_wear);

module.exports = router;
