const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 5000;

// میدلور
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Route اصلی
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Lomus API' });
});

// خطاهای ۴۰۴
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// هندلینگ خطاها
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});