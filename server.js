const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Basic route
app.get('/', (req, res) => {
  res.send('G-MedHub Backend is Successfully Running!');
});

// Test route to see if the user exists in the database
app.get('/api/auth/check-user', async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = 'builder@gmedhub.com'");
    if (user.rows.length > 0) {
      res.json({ 
        success: true, 
        message: "User found in database!", 
        user_email: user.rows[0].email,
        user_role: user.rows[0].role
      });
    } else {
      res.json({ success: false, message: "User NOT found in database." });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// Use Auth Routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
