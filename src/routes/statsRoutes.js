const express = require('express');
const router = express.Router();
const { getHospitalStats } = require('../controllers/statsController');

// @route   GET /api/stats
// @desc    Get dashboard statistics
router.get('/', getHospitalStats);

module.exports = router;