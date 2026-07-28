// backend/routes/seed.js
//
// TEMPORARY FILE — for creating test staff accounts only.
// Delete this file (and its line in your main server file) once you're done testing.
// Leaving this live permanently would let anyone who finds the URL create accounts.
//
// HOW TO USE:
// 1. Save this file at: backend/routes/seed.js
// 2. In your main server file (server.js or index.js), add this line near your other routes:
//      app.use('/api/seed', require('./routes/seed'));
// 3. Push to GitHub -> wait for Render to redeploy
// 4. Visit this URL ONCE in your browser (replace with your real backend URL):
//      https://YOUR-BACKEND-URL.onrender.com/api/seed/test-accounts
// 5. It will show a message confirming accounts were created (or already existed)
// 6. Delete this file + the line you added in step 2, push again, and forget it exists

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

router.get('/test-accounts', async (req, res) => {
  try {
    // Reuse whatever hospital already exists (e.g. the one your CMD account belongs to)
    const hospResult = await pool.query('SELECT id FROM hospitals LIMIT 1');
    if (hospResult.rows.length === 0) {
      return res.status(400).send('No hospital found — register a hospital first, then try again.');
    }
    const hospitalId = hospResult.rows[0].id;

    const testPassword = 'password123'; // same password for every test account, for simplicity
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    const testUsers = [
      { full_name: 'Test Doctor',       email: 'doctor@test.com',       role: 'Doctor' },
      { full_name: 'Test Receptionist', email: 'receptionist@test.com', role: 'Receptionist' },
      { full_name: 'Test Pharmacist',   email: 'pharmacist@test.com',   role: 'Pharmacist' },
      { full_name: 'Test Lab',          email: 'lab@test.com',          role: 'Lab_Scientist' },
      { full_name: 'Test Nurse',        email: 'nurse@test.com',        role: 'Nurse' },
    ];

    const created = [];
    const skipped = [];

    for (const u of testUsers) {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [u.email]);
      if (existing.rows.length > 0) {
        skipped.push(u.email);
        continue;
      }
      await pool.query(
        'INSERT INTO users (full_name, email, password, role, hospital_id) VALUES ($1, $2, $3, $4, $5)',
        [u.full_name, u.email, hashedPassword, u.role, hospitalId]
      );
      created.push(u.email);
    }

    res.send(`
      <h2>Done!</h2>
      <p><b>Created:</b> ${created.join(', ') || 'none'}</p>
      <p><b>Already existed (skipped):</b> ${skipped.join(', ') || 'none'}</p>
      <p>Password for all test accounts: <b>${testPassword}</b></p>
      <p style="color:red;">Now delete backend/routes/seed.js and remove it from your server file, then redeploy.</p>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong: ' + err.message);
  }
});

module.exports = router;
