const pool = require('../config/db');

// Register a new patient
exports.registerPatient = async (req, res) => {
  try {
    const { hospital_id, full_name, phone, gender, age, address, emergency_contact } = req.body;
    
    // We use RETURNING id so we can use it as their Unique Hospital Number
    const newPatient = await pool.query(
      `INSERT INTO patients (hospital_id, full_name, phone, gender, age, address, emergency_contact) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [hospital_id, full_name, phone, gender, age, address, emergency_contact]
    );
    
    res.json(newPatient.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Search for a patient by name, phone, or ID
exports.searchPatients = async (req, res) => {
  try {
    const { query, hospital_id } = req.query;
    
    const patients = await pool.query(
      `SELECT * FROM patients 
       WHERE hospital_id = $1 
       AND (full_name ILIKE $2 OR phone ILIKE $2 OR id::text ILIKE $2)`,
      [hospital_id, `%${query}%`]
    );
    
    res.json(patients.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
