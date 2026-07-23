const pool = require('../config/db');

// Get all drugs in inventory
exports.getDrugs = async (req, res) => {
  try {
    const { hospital_id } = req.query;
    const drugs = await pool.query(
      `SELECT * FROM pharmacy_inventory WHERE hospital_id = $1 ORDER BY drug_name ASC`, 
      [hospital_id]
    );
    res.json(drugs.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a new drug to inventory
exports.addDrug = async (req, res) => {
  try {
    const { hospital_id, drug_name, quantity, expiry_date, price } = req.body;
    const newDrug = await pool.query(
      `INSERT INTO pharmacy_inventory (hospital_id, drug_name, quantity, expiry_date, price) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [hospital_id, drug_name, quantity, expiry_date, price]
    );
    res.json(newDrug.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Dispense a drug (reduce quantity)
exports.dispenseDrug = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity_dispensed } = req.body;
    
    // Reduce the quantity in the database
    const updatedDrug = await pool.query(
      `UPDATE pharmacy_inventory SET quantity = quantity - $1 WHERE id = $2 AND quantity >= $1 RETURNING *`,
      [quantity_dispensed, id]
    );

    if (updatedDrug.rows.length === 0) {
      return res.status(400).json({ message: 'Not enough stock available!' });
    }

    res.json(updatedDrug.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
