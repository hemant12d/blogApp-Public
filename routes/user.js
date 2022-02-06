const router = require("express").Router();
const authController = require("../App/http/controllers/authController");


// Authentication Api endpoints
router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.login);
router.route("/forgetPassword").post(authController.forgetPassword);

module.exports = router;
