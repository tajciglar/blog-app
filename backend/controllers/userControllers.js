const passport = require("../middleware/passport")
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET

async function signUp (req, res) {
    await body('email').isEmail().withMessage('Must be a valid email').run(req);
    await body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').run(req);
    await body('confirm_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }).run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            formData: req.body,
            errors: errors.array()
        })
    }
 
    const userData = req.body;
    const result = await prisma.user.findUnique({
            where: {
                email: userData.email, 
            },
    });

    if (result !== null) {
        return res.json({
            errors: { email: "This email already exists" },
            formData: req.body
        })
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
        res.json({ success: true });
    } catch (err) {
        console.error(err);
    }
}

async function logIn (req, res) {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });

        return res.json({
            success: true,
            message: 'Login successful',
            redirectUrl: '/',
            token,
        });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

module.exports = {
    signUp,
    logIn
}