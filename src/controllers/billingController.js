const pool = require('../config/db');

// Create a new invoice/bill
exports.createInvoice = async (req, res) => {
  try {
    const { hospital_id, patient_id, description, amount } = req.body;
    
    const newInvoice = await pool.query(
      `INSERT INTO invoices (hospital_id, patient_id, description, amount, status) 
       VALUES ($1, $2, $3, $4, 'Unpaid') RETURNING *`,
      [hospital_id, patient_id, description, amount]
    );
    
    res.json(newInvoice.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all invoices for a hospital
exports.getInvoices = async (req, res) => {
  try {
    const { hospital_id } = req.query;
    const invoices = await pool.query(
      `SELECT i.*, p.full_name as patient_name 
       FROM invoices i 
       JOIN patients p ON i.patient_id = p.id 
       WHERE i.hospital_id = $1 
       ORDER BY i.created_at DESC`,
      [hospital_id]
    );
    res.json(invoices.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Process payment (mark as paid)
exports.processPayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedInvoice = await pool.query(
      `UPDATE invoices SET status = 'Paid' WHERE id = $1 RETURNING *`,
      [id]
    );
    
    res.json(updatedInvoice.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};