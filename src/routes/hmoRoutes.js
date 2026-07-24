const express = require('express');
const router = express.Router();
const { addClaim, getClaims, updateClaimStatus } = require('../controllers/hmoController');

// @route   POST /api/hmo
// @desc    Submit a claim
router.post('/', addClaim);

// @route   GET /api/hmo
// @desc    Get all claims
router.get('/', getClaims);

// @route   PUT /api/hmo/:id
// @desc    Update claim status
router.put('/:id', updateClaimStatus);

module.exports = router;
