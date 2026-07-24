const express = require('express');
const router = express.Router();
const { addANCVisit, getANCVisits } = require('../controllers/ancController');

// @route   POST /api/anc
// @desc    Add ANC visit
router.post('/', addANCVisit);

// @route   GET /api/anc/:patient_id
// @desc    Get patient ANC history
router.get('/:patient_id', getANCVisits);

module.exports = router;
