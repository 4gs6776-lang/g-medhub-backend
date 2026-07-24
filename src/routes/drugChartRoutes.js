const express = require('express');
const router = express.Router();
const { addChartEntry, getPatientChart } = require('../controllers/drugChartController');

// @route   POST /api/drugchart
// @desc    Add new entry to drug chart
router.post('/', addChartEntry);

// @route   GET /api/drugchart/:patient_id
// @desc    Get patient drug chart
router.get('/:patient_id', getPatientChart);

module.exports = router;