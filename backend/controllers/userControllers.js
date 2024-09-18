const passport = require("../middleware/passport")
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


function logIn (req, res) {

    
}

async function signUp (req, res) {
   
    await body('username').isEmail().withMessage('Must be a valid email').run(req);
    await body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long').run(req);
    await body('confirm_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }).run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            formData: req.body
        })
    }
 
    const userData = req.body;
    const result = await prisma.user.findUnique({
            where: {
                email: userData.username, 
            },
    });
    console.log(result)

    if (result !== null) {
        return res.status(400).json({
            errors: [{ msg: 'Username already exists' }],
            formData: req.body      
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await prisma.user.create({
            data: {
                name: userData.username,
                email: userData.email,
                password: hashedPassword
            }
        });
        res.redirect("/");
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    logIn,
    signUp
}