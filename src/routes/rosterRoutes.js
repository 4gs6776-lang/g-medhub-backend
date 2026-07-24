const express = require('express');
const router = express.Router();
const { addRosterEntry, getRoster } = require('../controllers/rosterController');

// @route   POST /api/roster
// @desc    Add staff to roster
router.post('/', addRosterEntry);

// @route   GET /api/roster
// @desc    Get all roster entries
router.get('/', getRoster);

module.exports = router;
