const express = require('express');
const router = express.Router();
const { getHospitalStaff, addStaff, deleteStaff, resetPassword } = require('../controllers/userController');

// @route   GET /api/users
// @desc    Get all hospital staff
router.get('/', getHospitalStaff);

// @route   POST /api/users
// @desc    Add a new staff member
router.post('/', addStaff);

// @route   DELETE /api/users/:id
// @desc    Delete a staff member
router.delete('/:id', deleteStaff);

// @route   PUT /api/users/:id/reset-password
// @desc    Reset staff password
router.put('/:id/reset-password', resetPassword);

module.exports = router;