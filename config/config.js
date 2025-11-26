
require('dotenv').config();

module.exports = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || ''
  }
};
