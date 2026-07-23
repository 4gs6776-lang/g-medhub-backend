const express = require('express');
const router = express.Router();
const { getHospitals, addHospital } = require('../controllers/hospitalController');

// @route   GET /api/hospitals
// @desc    Get all hospitals
router.get('/', getHospitals);

// @route   POST /api/hospitals
// @desc    Add a new hospital
router.post('/', addHospital);

module.exports = router;
