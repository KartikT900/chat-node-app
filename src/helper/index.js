const bcrypt = require('bcryptjs');

/**
 * To generate a random user ID
 *
 * @returns randomly generated UserID with the prefix being current year
 */
function generateRandomId() {
  const todaysDate = new Date(Date.now());
  const prefix = todaysDate.getFullYear();
  const suffix = parseInt(Math.random(0, 100000) * 10000);

  return `${prefix}${suffix}`;
}

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}
/**
 *
 * @param {string} string input that needs to be validated
 *
 * @returns {boolean} returns true if valid string or false otherwise
 */
function validateString(string) {
  if (!string) {
    return false;
  }
  if (typeof string !== 'string') {
    return false;
  }
  if (string.trim().length === 0) {
    return false;
  }

  return true;
}

/**
 *
 * @param {string} input The string to be validated for valid email
 *
 * @returns {boolean} Whether the passed in string is a valid email or not
 */
function validateEmail(input) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!input || typeof input !== 'string') return false;
  return regex.test(String(input).toLocaleLowerCase());
}

const helpers = {
  generateRandomId,
  hashPassword,
  validateEmail,
  validateString
};
module.exports = helpers;
