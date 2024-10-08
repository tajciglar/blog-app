const { Router } = require("express");
const userController = require("../controllers/userControllers");
const passport = require("passport");



const router = Router();

router.post("/signup", userController.signUp);

router.post('/login', userController.logIn);

router.get('/', passport.authenticate('jwt', { session: false }), userController.homePage);

router.get("/log-out",passport.authenticate('jwt', { session: false }), (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

router.get('/:id/:title', passport.authenticate('jwt', { session: false }), userController.showPost);
router.post('/:id/:title', passport.authenticate('jwt', { session: false }), userController.addComment);

module.exports = router;