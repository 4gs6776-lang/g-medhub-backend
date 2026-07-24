const pool = require('../config/db');

// Get hospital statistics for the dashboard
exports.getHospitalStats = async (req, res) => {
  try {
    const { hospital_id } = req.query;

    // 1. Total Patients
    const patients = await pool.query('SELECT COUNT(*) FROM patients WHERE hospital_id = $1', [hospital_id]);
    
    // 2. Today's Appointments
    const appts = await pool.query('SELECT COUNT(*) FROM appointments WHERE hospital_id = $1 AND appointment_date = CURRENT_DATE', [hospital_id]);
    
    // 3. Pending Lab Tests
    const labs = await pool.query("SELECT COUNT(*) FROM lab_tests WHERE hospital_id = $1 AND status = 'Pending'", [hospital_id]);
    
    // 4. Unpaid Bills (Total Amount)
    const bills = await pool.query("SELECT COALESCE(SUM(amount), 0) FROM invoices WHERE hospital_id = $1 AND status = 'Unpaid'", [hospital_id]);

    res.json({
      total_patients: parseInt(patients.rows[0].count),
      todays_appointments: parseInt(appts.rows[0].count),
      pending_labs: parseInt(labs.rows[0].count),
      unpaid_bills: parseFloat(bills.rows[0].coalesce)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};