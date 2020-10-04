require('dotenv').config();

const {
  PORT, MONGODB_URI, SESSION_SECRET,
} = process.env;

module.exports = {
  PORT,
  MONGODB_URI,
  SESSION_SECRET,
};
