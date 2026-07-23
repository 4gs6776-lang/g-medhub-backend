const express = require('express');
const router = express.Router();
const { createConsultation, getPatientConsultations } = require('../controllers/consultController');

// @route   POST /api/consultations
// @desc    Save a new consultation
router.post('/', createConsultation);

// @route   GET /api/consultations/:patient_id
// @desc    Get patient history
router.get('/:patient_id', getPatientConsultations);

module.exports = router;
