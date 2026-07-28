const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all staff for a specific hospital
exports.getHospitalStaff = async (req, res) => {
  try {
    const { hospital_id } = req.query;
    const staff = await pool.query(
      'SELECT id, full_name, email, role, created_at FROM users WHERE hospital_id = $1 ORDER BY created_at DESC', 
      [hospital_id]
    );
    res.json(staff.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a new staff member
exports.addStaff = async (req, res) => {
  try {
    const { hospital_id, full_name, email, password, role } = req.body;
    
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newStaff = await pool.query(
      `INSERT INTO users (hospital_id, full_name, email, password, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email, role`,
      [hospital_id || null, full_name || null, email, hashedPassword, role || 'Staff']
    );
    
    res.json(newStaff.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
};

// Delete a staff member
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Staff account deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
};

// Reset Password (Recreate)
exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
};