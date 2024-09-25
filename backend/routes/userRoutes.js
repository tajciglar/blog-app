const { Router } = require("express");
const userController = require("../controllers/userControllers");
const passport = require("passport");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs');


const router = Router();

router.post("/signup", userController.signUp);

router.post('/login', userController.logIn);

router.get('/', (req, res, next) => {
    next();
}, passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: 'You are authenticated', user: req.user, redirectUrl: "/" });
});


module.exports = router;