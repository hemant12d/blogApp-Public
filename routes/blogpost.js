const router = require("express").Router();
const blogPostController = require("../App/http/controllers/blogPostController");

// Application status & roles configuation
const defaultConfig = require('../config/constants');

// Middlewares
const accessController = require("../App/middleware/accessController");
const authenticator = require("../App/middleware/authenticator");

// Blog Api endpoints
router.route("/").post(authenticator, accessController(defaultConfig.accessWrite), blogPostController.create).get(blogPostController.getAll);

// router.route("/search/:search").get(blogPostController.search);

router.route("/:id")
.get(blogPostController.getOne)
.patch(blogPostController.updateOne)
.delete(authenticator, accessController(defaultConfig.accessRemove), blogPostController.deleteOne)


module.exports = router;