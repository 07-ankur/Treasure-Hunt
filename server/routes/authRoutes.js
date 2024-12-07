const router = require("express").Router();
const {loginUser, registerUser} = require("../controllers/authController.js")

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;