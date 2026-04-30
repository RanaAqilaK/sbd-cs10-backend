// Vercel serverless entry point
require('dotenv').config();
const app = require('../src/app');

// Export untuk Vercel
module.exports = app;
