// src/routes/nurseRoutes.js
//
// PLACEHOLDER — this file exists just so the server can start.
// Your server.js already expects this file (it was requiring it before it existed,
// which is what crashed your app on Render).
// We'll add real nurse features (like the Drug Administration Chart) into this file later.

const express = require('express');
const router = express.Router();

// Simple test route — visit /api/nurse/ping to confirm this file is working
router.get('/ping', (req, res) => {
  res.json({ message: 'Nurse routes are working (placeholder for now).' });
});

module.exports = router;
