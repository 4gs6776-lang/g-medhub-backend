const express = require('express');
const router = express.Router();
const { createInvoice, getInvoices, processPayment } = require('../controllers/billingController');

// @route   POST /api/billing
// @desc    Create invoice
router.post('/', createInvoice);

// @route   GET /api/billing
// @desc    Get all invoices
router.get('/', getInvoices);

// @route   PUT /api/billing/:id/pay
// @desc    Process payment
router.put('/:id/pay', processPayment);

module.exports = router;