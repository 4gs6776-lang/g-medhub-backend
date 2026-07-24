const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const hospitalRoutes = require('./src/routes/hospitalRoutes');
const patientRoutes = require('./src/routes/patientRoutes');
const consultRoutes = require('./src/routes/consultRoutes');
const labRoutes = require('./src/routes/labRoutes');
const pharmacyRoutes = require('./src/routes/pharmacyRoutes');
const nurseRoutes = require('./src/routes/nurseRoutes');
const billingRoutes = require('./src/routes/billingRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const drugChartRoutes = require('./src/routes/drugChartRoutes');
const ancRoutes = require('./src/routes/ancRoutes');
const rosterRoutes = require('./src/routes/rosterRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Basic route
app.get('/', (req, res) => {
  res.send('G-MedHub Backend is Successfully Running!');
});

// Test route to see if the user exists in the database
app.get('/api/auth/check-user', async (req, res) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = 'builder@gmedhub.com'");
    if (user.rows.length > 0) {
      res.json({ 
        success: true, 
        message: "User found in database!", 
        user_email: user.rows[0].email,
        user_role: user.rows[0].role
      });
    } else {
      res.json({ success: false, message: "User NOT found in database." });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// Route to forcefully fix the Super Admin password
app.get('/api/auth/fix-password', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash('superadmin123', salt);

    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [newHashedPassword, 'builder@gmedhub.com']);
    
    res.send("Password fixed successfully! You can now login with password: superadmin123");
  } catch (err) {
    res.status(500).send("Error fixing password: " + err.message);
  }
});

// Foolproof route to setup the Hallel CMD account
app.get('/api/auth/setup-cmd', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('hallel123', salt);

    let hospital = await pool.query("SELECT * FROM hospitals WHERE name = 'Hallel Hospital'");
    let hospitalId;

    if (hospital.rows.length === 0) {
      const newHospital = await pool.query("INSERT INTO hospitals (name, subscription_tier) VALUES ('Hallel Hospital', 'Premium') RETURNING id");
      hospitalId = newHospital.rows[0].id;
    } else {
      hospitalId = hospital.rows[0].id;
    }

    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', ['cmd@hallel.com']);
    
    if (userCheck.rows.length > 0) {
      await pool.query('UPDATE users SET password = $1, hospital_id = $2 WHERE email = $3', [hashedPassword, hospitalId, 'cmd@hallel.com']);
      return res.send(`CMD account updated for Hospital ID ${hospitalId}! You can now login with password: hallel123`);
    }

    await pool.query(
      'INSERT INTO users (hospital_id, full_name, email, password, role) VALUES ($1, $2, $3, $4, $5)',
      [hospitalId, 'Hallel CMD', 'cmd@hallel.com', hashedPassword, 'CMD']
    );
    
    res.send(`CMD account created for Hospital ID ${hospitalId}! You can now login with password: hallel123`);
  } catch (err) {
    res.status(500).send('Error setting up CMD: ' + err.message);
  }
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/consultations', consultRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/nurse', nurseRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/drugchart', drugChartRoutes);
app.use('/api/anc', ancRoutes);
app.use('/api/roster', rosterRoutes);

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
