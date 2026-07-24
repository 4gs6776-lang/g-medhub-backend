const pool = require('../config/db');

// Schedule a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { hospital_id, patient_id, doctor_id, appointment_date, reason } = req.body;
    
    const newAppt = await pool.query(
      `INSERT INTO appointments (hospital_id, patient_id, doctor_id, appointment_date, reason, status) 
       VALUES ($1, $2, $3, $4, $5, 'Scheduled') RETURNING *`,
      [hospital_id, patient_id, doctor_id, appointment_date, reason]
    );
    
    res.json(newAppt.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all appointments for a hospital
exports.getAppointments = async (req, res) => {
  try {
    const { hospital_id } = req.query;
    const appts = await pool.query(
      `SELECT a.*, p.full_name as patient_name, u.full_name as doctor_name 
       FROM appointments a 
       JOIN patients p ON a.patient_id = p.id 
       JOIN users u ON a.doctor_id = u.id 
       WHERE a.hospital_id = $1 
       ORDER BY a.appointment_date DESC`,
      [hospital_id]
    );
    res.json(appts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update appointment status (e.g., Complete or Cancel)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedAppt = await pool.query(
      `UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    
    res.json(updatedAppt.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};