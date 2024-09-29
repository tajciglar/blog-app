const { Router } = require("express");
const userController = require("../controllers/userControllers");
const passport = require("passport");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs');



const router = Router();

router.post("/signup", userController.signUp);

router.post('/login', userController.logIn);

router.get('/', passport.authenticate('jwt', { session: false }), userController.homePage);

router.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

router.get('/:id/:title', userController.showPost);

module.exports = router;