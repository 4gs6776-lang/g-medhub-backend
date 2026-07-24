const pool = require('../config/db');

// Get comprehensive hospital reports
exports.getHospitalReports = async (req, res) => {
  try {
    const { hospital_id } = req.query;

    // 1. Total Revenue (Paid Invoices)
    const revenue = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE hospital_id = $1 AND status = 'Paid'", [hospital_id]);
    
    // 2. Outstanding Bills (Unpaid Invoices)
    const outstanding = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE hospital_id = $1 AND status = 'Unpaid'", [hospital_id]);
    
    // 3. Pending HMO Claims Amount
    const pendingHmo = await pool.query("SELECT COALESCE(SUM(claim_amount), 0) as total FROM hmo_claims WHERE hospital_id = $1 AND status = 'Pending'", [hospital_id]);
    
    // 4. Total Drugs in Stock
    const drugStock = await pool.query("SELECT COALESCE(SUM(quantity), 0) as total FROM pharmacy_inventory WHERE hospital_id = $1", [hospital_id]);
    
    // 5. Total Admitted Patients (Occupied Beds)
    const admitted = await pool.query("SELECT COUNT(*) as total FROM beds WHERE hospital_id = $1 AND status = 'Occupied'", [hospital_id]);
    
    // 6. Total ANC Patients
    const ancCount = await pool.query("SELECT COUNT(*) as total FROM patients WHERE hospital_id = $1 AND category = 'ANC folder'", [hospital_id]);

    res.json({
      total_revenue: parseFloat(revenue.rows[0].total),
      outstanding_bills: parseFloat(outstanding.rows[0].total),
      pending_hmo_claims: parseFloat(pendingHmo.rows[0].total),
      total_drugs_in_stock: parseInt(drugStock.rows[0].total),
      admitted_patients: parseInt(admitted.rows[0].total),
      total_anc_patients: parseInt(ancCount.rows[0].total)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
