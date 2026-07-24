const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/auditController');

// @route   GET /api/audit
// @desc    Get audit logs
router.get('/', getLogs);

module.exports = router;
