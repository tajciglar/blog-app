const { Router } = require("express");
const userController = require("../controllers/userControllers");

const router = { Router };

router.get("/", userController.getIndexPage);

module.exports = router;