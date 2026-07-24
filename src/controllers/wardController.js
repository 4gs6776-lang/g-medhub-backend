const pool = require('../config/db');

// Add a new bed to the hospital
exports.addBed = async (req, res) => {
  try {
    const { hospital_id, bed_number, ward_name } = req.body;
    
    const newBed = await pool.query(
      `INSERT INTO beds (hospital_id, bed_number, ward_name) 
       VALUES ($1, $2, $3) RETURNING *`,
      [hospital_id, bed_number, ward_name]
    );
    
    res.json(newBed.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all beds for a hospital
exports.getBeds = async (req, res) => {
  try {
    const { hospital_id } = req.query;
    const beds = await pool.query(
      `SELECT b.*, p.full_name as patient_name 
       FROM beds b 
       LEFT JOIN patients p ON b.patient_id = p.id 
       WHERE b.hospital_id = $1 
       ORDER BY b.ward_name ASC, b.bed_number ASC`,
      [hospital_id]
    );
    res.json(beds.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admit a patient to a bed
exports.admitPatient = async (req, res) => {
  try {
    const { id } = req.params; // bed id
    const { patient_id } = req.body;
    
    const updatedBed = await pool.query(
      `UPDATE beds 
       SET patient_id = $1, status = 'Occupied', admit_date = CURRENT_TIMESTAMP 
       WHERE id = $2 RETURNING *`,
      [patient_id, id]
    );
    
    res.json(updatedBed.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Discharge a patient from a bed
exports.dischargePatient = async (req, res) => {
  try {
    const { id } = req.params; // bed id
    
    const updatedBed = await pool.query(
      `UPDATE beds 
       SET patient_id = NULL, status = 'Available', admit_date = NULL 
       WHERE id = $1 RETURNING *`,
      [id]
    );
    
    res.json(updatedBed.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
