const pool = require('../config/db');

// Get all hospitals (Only for Super Admin)
exports.getHospitals = async (req, res) => {
  try {
    const hospitals = await pool.query('SELECT * FROM hospitals ORDER BY created_at DESC');
    res.json(hospitals.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a new hospital
exports.addHospital = async (req, res) => {
  try {
    const { name, subscription_tier } = req.body;
    const newHospital = await pool.query(
      'INSERT INTO hospitals (name, subscription_tier) VALUES ($1, $2) RETURNING *',
      [name, subscription_tier]
    );
    res.json(newHospital.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
