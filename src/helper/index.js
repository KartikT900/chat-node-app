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
  return bcrypt.hash(password, 10);
}

module.exports = {
  generateRandomId,
  hashPassword
};
