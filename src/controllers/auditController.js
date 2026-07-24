const pool = require('../config/db');

// Get all audit logs for a hospital
exports.getLogs = async (req, res) => {
  try {
    const { hospital_id } = req.query;
    const logs = await pool.query(
      'SELECT * FROM audit_logs WHERE hospital_id = $1 ORDER BY created_at DESC LIMIT 100', 
      [hospital_id]
    );
    res.json(logs.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
