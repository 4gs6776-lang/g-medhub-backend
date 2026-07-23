const express = require('express');
const router = express.Router();
const { registerPatient, searchPatients } = require('../controllers/patientController');

// @route   POST /api/patients/register
// @desc    Register a new patient
router.post('/register', registerPatient);

// @route   GET /api/patients/search
// @desc    Search for a patient
router.get('/search', searchPatients);

module.exports = router;
