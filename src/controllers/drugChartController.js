const pool = require('../config/db');

// Add a new drug record
exports.addChartEntry = async (req, res) => {
  try {
    const { 
      hospital_id, patient_id, entry_date, entry_time, drug_name, dosage, 
      route, frequency, duration, prescribing_doctor, administering_nurse, status, remarks 
    } = req.body;
    
    const newEntry = await pool.query(
      `INSERT INTO patient_drug_charts 
       (hospital_id, patient_id, entry_date, entry_time, drug_name, dosage, route, frequency, duration, prescribing_doctor, administering_nurse, status, remarks) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [hospital_id, patient_id, entry_date, entry_time, drug_name, dosage, route, frequency, duration, prescribing_doctor, administering_nurse, status, remarks]
    );
    
    res.json(newEntry.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get patient drug history (Newest first)
exports.getPatientChart = async (req, res) => {
  try {
    const { patient_id } = req.params;
    
    const entries = await pool.query(
      `SELECT * FROM patient_drug_charts WHERE patient_id = $1 ORDER BY created_at DESC`,
      [patient_id]
    );
    res.json(entries.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update/Edit a drug record
exports.updateChartEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      entry_date, entry_time, drug_name, dosage, route, frequency, duration, 
      prescribing_doctor, administering_nurse, status, remarks 
    } = req.body;
    
    const updatedEntry = await pool.query(
      `UPDATE patient_drug_charts 
       SET entry_date = $1, entry_time = $2, drug_name = $3, dosage = $4, route = $5, 
           frequency = $6, duration = $7, prescribing_doctor = $8, administering_nurse = $9, 
           status = $10, remarks = $11 
       WHERE id = $12 RETURNING *`,
      [entry_date, entry_time, drug_name, dosage, route, frequency, duration, prescribing_doctor, administering_nurse, status, remarks, id]
    );
    
    res.json(updatedEntry.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a drug record
exports.deleteChartEntry = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM patient_drug_charts WHERE id = $1`, [id]);
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};