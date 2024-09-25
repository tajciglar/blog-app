const express = require('express');
const dotenv = require('dotenv');
const passport = require('./middleware/passport');
const cors = require('cors');
const path = require('path');
dotenv.config();

const app = express();

app.use(cors()); 

app.use(express.json());

app.use(passport.initialize());

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.use('/users', express.static(path.join(__dirname, '../frontend-users/dist')));
app.use('/admin', express.static(path.join(__dirname, '../frontend-admin/dist')));


app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API route not found' });
  }
 
  if (req.path.startsWith('/admin')) {
    res.sendFile(path.join(__dirname, '../frontend-admin/dist', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, '../frontend-users/dist', 'index.html'));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
