const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes'); // Import Auth Routes

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Basic route
app.get('/', (req, res) => {
  res.send('G-MedHub Backend is Successfully Running!');
});

// Database test route
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected successfully!', time: result.rows[0].now });
  } catch (err) {
    console.error('Database connection error', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Use Auth Routes (This means the login link will be /api/auth/login)
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});