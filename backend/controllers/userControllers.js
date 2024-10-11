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

        const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });

         return res.json({
            success: true,
            role: user.role,
            token,
        }); 
    
        
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

async function homePage(req, res) {

    try {
        const posts = await prisma.post.findMany();
        res.json({ message: 'You are authenticated', user: req.user, posts });
    } catch (err) {
        console.error(err);
    }
    
}

async function showPost(req, res) {
    const { id } = req.params;

    try {
        const post = await prisma.post.findUnique({
            where: {
                id: id, 
            },
        });

        const comments = await prisma.comment.findMany({
            where: {
                postId: post.id,
            },
            include: {
                author: {
                    select: {
                        name: true, 
                    },
                },
            },
        });


        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({post, comments}); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred' });
    }
}


async function addComment(req, res) {
    const postId = req.params.id;
    const data = req.body;

    try {
        const commentData = await prisma.comment.create({
            data: {
                postId: postId,
                authorId: data.userId,
                content: data.newComment,
            },
            include: {
                author: {
                    select: {
                        name: true,
                    }
                }
            },
        });
        return res.status(201).json({ success: true, commentData: commentData });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'An error occurred while adding the comment' });
    }
}


module.exports = {
    signUp,
    logIn,
    homePage,
    showPost,
    addComment
}