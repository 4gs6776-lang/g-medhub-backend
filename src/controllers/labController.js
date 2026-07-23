const pool = require('../config/db');

// Get all lab tests for a hospital
exports.getLabTests = async (req, res) => {
  try {
    const { hospital_id } = req.query;
    const tests = await pool.query(
      `SELECT l.*, p.full_name as patient_name 
       FROM lab_tests l 
       JOIN patients p ON l.patient_id = p.id 
       WHERE l.hospital_id = $1 
       ORDER BY l.created_at DESC`,
      [hospital_id]
    );
    res.json(tests.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update lab test result and status
exports.updateLabResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { result, status } = req.body;
    
    const updatedTest = await pool.query(
      `UPDATE lab_tests SET result = $1, status = $2 WHERE id = $3 RETURNING *`,
      [result, status, id]
    );
    
    res.json(updatedTest.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
