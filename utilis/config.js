const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Load .env file

const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
  NODE_ENV: process.env.NODE_ENV, // Export NODE_ENV for debugging
};
