const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware to understand JSON data
app.use(express.json());
app.use(cors());

// A simple test route to see if the server is working
app.get('/', (req, res) => {
  res.send('G-MedHub Backend is Successfully Running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});