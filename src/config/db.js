const { Pool } = require('pg');
require('dotenv').config();

// This connects to your Neon.tech database using the secret URL you put in Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;