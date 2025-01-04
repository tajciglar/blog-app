const express = require('express');
const dotenv = require('dotenv');
const passport = require('./middleware/passport');
const cors = require('cors');
const path = require('path');
dotenv.config();

const app = express();

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://tajsblogapp.netlify.app', // Production URL
            'http://localhost:5173' // Development URL
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Adjust methods as needed
    credentials: true, // Allow credentials if needed
};

app.use(cors(corsOptions)); 

app.use(express.json());

app.use(passport.initialize());

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.use('/users', express.static(path.join(__dirname, '../frontend-users/dist')));
app.use('/admin', express.static(path.join(__dirname, '../frontend-admin/dist')));


app.get('/api/editor', (req, res) => {
  const apiKey = process.env.TINY_API;
  res.json({apiKey})
})

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API route not found' });
  }
 
  if (req.path.startsWith('/admin')) {
    res.sendFile(path.join(__dirname, '../frontend-users/dist', 'index.html'));
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
