const pool = require('../config/db');

// Save patient vitals and notes
exports.saveVitals = async (req, res) => {
  try {
    const { hospital_id, patient_id, nurse_id, temperature, heart_rate, respiration, blood_pressure, oxygen_saturation, body_weight, nursing_notes } = req.body;
    
    const newRecord = await pool.query(
      `INSERT INTO nursing_records 
       (hospital_id, patient_id, nurse_id, temperature, pulse, respiration, blood_pressure, oxygen_saturation, body_weight, nursing_notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [hospital_id, patient_id, nurse_id, temperature, heart_rate, respiration, blood_pressure, oxygen_saturation, body_weight, nursing_notes]
    );
    
    res.json(newRecord.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get patient vitals history
exports.getPatientVitals = async (req, res) => {
  try {
    const { patient_id } = req.params;
    
    const history = await pool.query(
      `SELECT * FROM nursing_records WHERE patient_id = $1 ORDER BY created_at DESC`,
      [patient_id]
    );
    
    res.json(history.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
