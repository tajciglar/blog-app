const { Router } = require("express");
const adminControllers = require("../controllers/adminControllers");
const passport = require("passport");

const router = Router();

router.delete('/delete/:postId', passport.authenticate('jwt', { session: false }) ,adminControllers.deletePost);

router.put('/edit/:postId', passport.authenticate('jwt', { session: false }), adminControllers.editPost);

router.post('/newPost', passport.authenticate('jwt', { session: false }), adminControllers.newPost);


module.exports = router;