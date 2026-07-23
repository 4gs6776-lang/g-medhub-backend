const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes'); // Import Auth Routes

const app = express();
// Temporary route to create your Super Admin account safely
app.get('/setup-admin', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('superadmin123', salt);

    // Check if the user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', ['builder@gmedhub.com']);
    
    if (userCheck.rows.length > 0) {
      // If user exists, just update their password to be safe
      await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, 'builder@gmedhub.com']);
      return res.send('Super Admin password updated successfully! You can now login.');
    }

    // If user doesn't exist, create them
    await pool.query(
      'INSERT INTO users (hospital_id, full_name, email, password, role) VALUES ($1, $2, $3, $4, $5)',
      [1, 'G-MedHub Builder', 'builder@gmedhub.com', hashedPassword, 'Super Admin']
    );
    
    res.send('Super Admin created successfully! You can now login.');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error during setup');
  }
});

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