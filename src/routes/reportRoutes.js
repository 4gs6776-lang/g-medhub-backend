const express = require('express');
const router = express.Router();
const { getHospitalReports } = require('../controllers/reportController');

// @route   GET /api/reports
// @desc    Get hospital financial and operational reports
router.get('/', getHospitalReports);

module.exports = router;
