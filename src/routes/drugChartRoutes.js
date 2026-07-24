const express = require('express');
const router = express.Router();
const { addChartEntry, getPatientChart, updateChartEntry, deleteChartEntry } = require('../controllers/drugChartController');

// @route   POST /api/drugchart
// @desc    Add new entry
router.post('/', addChartEntry);

// @route   GET /api/drugchart/:patient_id
// @desc    Get patient drug history
router.get('/:patient_id', getPatientChart);

// @route   PUT /api/drugchart/:id
// @desc    Edit entry
router.put('/:id', updateChartEntry);

// @route   DELETE /api/drugchart/:id
// @desc    Delete entry
router.delete('/:id', deleteChartEntry);

module.exports = router;
