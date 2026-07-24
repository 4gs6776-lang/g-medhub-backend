const pool = require('../config/db');

// Submit a new HMO claim
exports.addClaim = async (req, res) => {
  try {
    const { hospital_id, patient_id, hmo_name, service_code, diagnosis_code, claim_amount } = req.body;
    
    const newClaim = await pool.query(
      `INSERT INTO hmo_claims (hospital_id, patient_id, hmo_name, service_code, diagnosis_code, claim_amount) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [hospital_id, patient_id, hmo_name, service_code, diagnosis_code, claim_amount]
    );
    
    res.json(newClaim.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all HMO claims for a hospital
exports.getClaims = async (req, res) => {
  try {
    const { hospital_id } = req.query;
    const claims = await pool.query(
      `SELECT h.*, p.full_name as patient_name 
       FROM hmo_claims h 
       JOIN patients p ON h.patient_id = p.id 
       WHERE h.hospital_id = $1 
       ORDER BY h.created_at DESC`,
      [hospital_id]
    );
    res.json(claims.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update claim status (Approve/Reject)
exports.updateClaimStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved' or 'Rejected'
    
    const updatedClaim = await pool.query(
      `UPDATE hmo_claims SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    
    res.json(updatedClaim.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
