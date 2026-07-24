const pool = require('../config/db');

// Add a new ANC visit record
exports.addANCVisit = async (req, res) => {
  try {
    const { hospital_id, patient_id, visit_date, gestational_age, blood_pressure, fetal_heart_rate, weight, findings, next_appointment } = req.body;
    
    const newVisit = await pool.query(
      `INSERT INTO anc_visits 
       (hospital_id, patient_id, visit_date, gestational_age, blood_pressure, fetal_heart_rate, weight, findings, next_appointment) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [hospital_id, patient_id, visit_date, gestational_age, blood_pressure, fetal_heart_rate, weight, findings, next_appointment]
    );
    
    res.json(newVisit.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get ANC history for a patient
exports.getANCVisits = async (req, res) => {
  try {
    const { patient_id } = req.params;
    
    const visits = await pool.query(
      `SELECT * FROM anc_visits WHERE patient_id = $1 ORDER BY visit_date DESC`,
      [patient_id]
    );
    res.json(visits.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
