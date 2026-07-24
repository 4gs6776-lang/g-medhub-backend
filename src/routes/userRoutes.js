const express = require('express');
const router = express.Router();
const { getHospitalStaff, addStaff } = require('../controllers/userController');

// @route   GET /api/users
// @desc    Get all hospital staff
router.get('/', getHospitalStaff);

// @route   POST /api/users
// @desc    Add a new staff member
router.post('/', addStaff);

module.exports = router;
