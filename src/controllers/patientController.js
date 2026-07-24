const pool = require('../config/db');

// Get ALL patients for a hospital
exports.getAllPatients = async (req, res) => {
  try {
    const { hospital_id } = req.query;
    const patients = await pool.query('SELECT * FROM patients WHERE hospital_id = $1 ORDER BY created_at DESC', [hospital_id]);
    res.json(patients.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get ALL ANC patients for a hospital (Auto-update feature)
exports.getAncPatients = async (req, res) => {
  try {
    const { hospital_id } = req.query;
    const patients = await pool.query(
      "SELECT * FROM patients WHERE hospital_id = $1 AND category = 'ANC folder' ORDER BY created_at DESC", 
      [hospital_id]
    );
    res.json(patients.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Register a new patient with full biodata
exports.registerPatient = async (req, res) => {
  try {
    const { 
      hospital_id, surname, other_names, phone, email, gender, marital_status, dob, age, blood_group,
      address, state_of_origin, nationality, occupation, religion, category,
      next_of_kin_name, next_of_kin_relationship, next_of_kin_phone, next_of_kin_address 
    } = req.body;
    
    const full_name = `${surname} ${other_names}`;
    const cleanAge = age ? parseInt(age) : null;
    const cleanCategory = category || 'Personal folder';
    
    const newPatient = await pool.query(
      `INSERT INTO patients (
        hospital_id, full_name, surname, other_names, phone, email, gender, marital_status, dob, age, blood_group,
        address, state_of_origin, nationality, occupation, religion, category,
        next_of_kin_name, next_of_kin_relationship, next_of_kin_phone, next_of_kin_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *`,
      [hospital_id, full_name, surname, other_names, phone, email, gender, marital_status, dob, cleanAge, blood_group,
       address, state_of_origin, nationality, occupation, religion, cleanCategory,
       next_of_kin_name, next_of_kin_relationship, next_of_kin_phone, next_of_kin_address]
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
