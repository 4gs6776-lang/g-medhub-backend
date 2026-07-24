const express = require('express');
const router = express.Router();
const { getAllPatients, registerPatient, searchPatients } = require('../controllers/patientController');

// @route   GET /api/patients
// @desc    Get all patients
router.get('/', getAllPatients);

// @route   POST /api/patients/register
// @desc    Register a new patient
router.post('/register', registerPatient);

// @route   GET /api/patients/search
// @desc    Search for a patient
router.get('/search', searchPatients);

module.exports = router;
