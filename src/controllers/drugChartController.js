const pool = require('../config/db');

// Add a new row to the drug chart
exports.addChartEntry = async (req, res) => {
  try {
    const { hospital_id, patient_id, nurse_id, entry_date, entry_time, medication, dosage, next_dose_time, route, frequency, sign } = req.body;
    
    const newEntry = await pool.query(
      `INSERT INTO drug_chart_entries 
       (hospital_id, patient_id, nurse_id, entry_date, entry_time, medication, dosage, next_dose_time, route, frequency, sign) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [hospital_id, patient_id, nurse_id, entry_date, entry_time, medication, dosage, next_dose_time, route, frequency, sign]
    );
    
    res.json(newEntry.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all chart entries for a patient
exports.getPatientChart = async (req, res) => {
  try {
    const { patient_id } = req.params;
    
    const entries = await pool.query(
      `SELECT * FROM drug_chart_entries WHERE patient_id = $1 ORDER BY created_at ASC`,
      [patient_id]
    );
    res.json(entries.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};