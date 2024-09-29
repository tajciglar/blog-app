const { Router } = require("express");
const postController = require("../controllers/postControllers");

const router = Router();

router.get("/", postController.createPost);



module.exports = router;