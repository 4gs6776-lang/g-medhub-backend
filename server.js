const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes'); // Import Auth Routes

const app = express();

// Smarter setup route to create hospital AND admin
app.get('/setup-admin', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('superadmin123', salt);

    // 1. Check if hospital exists, if not, create it
    let hospital = await pool.query("SELECT * FROM hospitals WHERE name = 'G-MedHub Main Hospital'");
    let hospitalId;

    if (hospital.rows.length === 0) {
      const newHospital = await pool.query(
        "INSERT INTO hospitals (name, subscription_tier) VALUES ('G-MedHub Main Hospital', 'Premium') RETURNING id"
      );
      hospitalId = newHospital.rows[0].id;
    } else {
      hospitalId = hospital.rows[0].id;
    }

    // 2. Check if user exists, if not create, if yes update password
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', ['builder@gmedhub.com']);
    
    if (userCheck.rows.length > 0) {
      await pool.query('UPDATE users SET password = $1, hospital_id = $2 WHERE email = $3', [hashedPassword, hospitalId, 'builder@gmedhub.com']);
      return res.send('Super Admin password updated! Hospital ID: ' + hospitalId + '. You can now login.');
    }

    await pool.query(
      'INSERT INTO users (hospital_id, full_name, email, password, role) VALUES ($1, $2, $3, $4, $5)',
      [hospitalId, 'G-MedHub Builder', 'builder@gmedhub.com', hashedPassword, 'Super Admin']
    );
    
    res.send('Super Admin created! Hospital ID: ' + hospitalId + '. You can now login.');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error during setup: ' + err.message);
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