const { Router } = require("express");
const userController = require("../controllers/userControllers");

const router = Router();

router.post("/login", userController.logIn);
router.post("/signup", userController.signUp);

module.exports = router;