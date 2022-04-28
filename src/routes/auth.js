const router = require("express").Router();
const { registerView, loginView } = require("../controllers/auth_controller");

router.post("/register", registerView);
router.post("/login", loginView);

module.exports = router;
