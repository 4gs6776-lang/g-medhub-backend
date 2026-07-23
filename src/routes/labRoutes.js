const express = require('express');
const router = express.Router();
const { getLabTests, updateLabResult } = require('../controllers/labController');

// @route   GET /api/labs
// @desc    Get all lab tests
router.get('/', getLabTests);

// @route   PUT /api/labs/:id
// @desc    Update lab result
router.put('/:id', updateLabResult);

module.exports = router;
