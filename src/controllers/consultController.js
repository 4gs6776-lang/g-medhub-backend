const pool = require('../config/db');

// Create a new consultation record
exports.createConsultation = async (req, res) => {
  try {
    const { hospital_id, patient_id, doctor_id, symptoms, diagnosis, treatment_plan } = req.body;
    
    const newConsult = await pool.query(
      `INSERT INTO consultations (hospital_id, patient_id, doctor_id, symptoms, diagnosis, treatment_plan) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [hospital_id, patient_id, doctor_id, symptoms, diagnosis, treatment_plan]
    );
    
    res.json(newConsult.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a patient's consultation history
exports.getPatientConsultations = async (req, res) => {
  try {
    const { patient_id } = req.params;
    
    const history = await pool.query(
      `SELECT * FROM consultations WHERE patient_id = $1 ORDER BY created_at DESC`,
      [patient_id]
    );
    
    res.json(history.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
