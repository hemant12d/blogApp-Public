const router = require("express").Router();
const categoryController = require("../App/http/controllers/categoryController");

// Application status & roles configuation
const defaultConfig = require('../config/constants');

// Middlewares
const accessController = require("../App/middleware/accessController");
const authenticator = require("../App/middleware/authenticator");

// Blog Api endpoints
router.route("/").post(categoryController.create).get(categoryController.getAll);
// authenticator, accessController(defaultConfig.accessWrite), 

router.route("/:id")
.get(authenticator, accessController(defaultConfig.accessRead), categoryController.getOne)
.patch(categoryController.updateOne)
.delete(categoryController.deleteOne)


module.exports = router;