const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login Function
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user in the database by email
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // 2. Check if the password matches (using bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 3. Create a secure token (JWT) that lasts for 1 day
    const payload = {
      userId: user.id,
      role: user.role,
      hospital_id: user.hospital_id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 4. Send the token and user info back to the app
    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        hospital_id: user.hospital_id
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};