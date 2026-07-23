const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./src/config/db'); // Import the database connection

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Basic route to check if server is running
app.get('/', (req, res) => {
  res.send('G-MedHub Backend is Successfully Running!');
});

// New route to test if the database is connected
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected successfully!', time: result.rows[0].now });
  } catch (err) {
    console.error('Database connection error', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});