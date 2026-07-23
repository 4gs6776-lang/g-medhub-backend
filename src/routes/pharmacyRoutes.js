const express = require('express');
const router = express.Router();
const { getDrugs, addDrug, dispenseDrug } = require('../controllers/pharmacyController');

// @route   GET /api/pharmacy
// @desc    Get all drugs
router.get('/', getDrugs);

// @route   POST /api/pharmacy
// @desc    Add new drug
router.post('/', addDrug);

// @route   PUT /api/pharmacy/:id/dispense
// @desc    Dispense drug
router.put('/:id/dispense', dispenseDrug);

module.exports = router;
