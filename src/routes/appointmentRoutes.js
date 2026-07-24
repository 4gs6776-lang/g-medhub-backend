const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateStatus } = require('../controllers/appointmentController');

// @route   POST /api/appointments
// @desc    Create appointment
router.post('/', createAppointment);

// @route   GET /api/appointments
// @desc    Get all appointments
router.get('/', getAppointments);

// @route   PUT /api/appointments/:id
// @desc    Update status
router.put('/:id', updateStatus);

module.exports = router;