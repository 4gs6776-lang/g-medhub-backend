const express = require('express');
const router = express.Router();
const { addBed, getBeds, admitPatient, dischargePatient } = require('../controllers/wardController');

// @route   POST /api/wards
// @desc    Add new bed
router.post('/', addBed);

// @route   GET /api/wards
// @desc    Get all beds
router.get('/', getBeds);

// @route   PUT /api/wards/:id/admit
// @desc    Admit patient to bed
router.put('/:id/admit', admitPatient);

// @route   PUT /api/wards/:id/discharge
// @desc    Discharge patient from bed
router.put('/:id/discharge', dischargePatient);

module.exports = router;
