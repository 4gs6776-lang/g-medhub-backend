const pool = require('../config/db');

// Add a new roster entry
exports.addRosterEntry = async (req, res) => {
  try {
    const { hospital_id, staff_name, role, shift, shift_date, notes } = req.body;
    
    const newEntry = await pool.query(
      `INSERT INTO rosters (hospital_id, staff_name, role, shift, shift_date, notes) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [hospital_id, staff_name, role, shift, shift_date, notes]
    );
    
    res.json(newEntry.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all roster entries for a hospital
exports.getRoster = async (req, res) => {
  try {
    const { hospital_id } = req.query;
    const roster = await pool.query(
      'SELECT * FROM rosters WHERE hospital_id = $1 ORDER BY shift_date DESC, id DESC', 
      [hospital_id]
    );
    res.json(roster.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
