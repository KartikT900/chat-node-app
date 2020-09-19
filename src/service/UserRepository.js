const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { generateUserId, hashPassword } = require('../helper');

class UserRepository {
  static async decodePassword(plainText, password) {
    return await bcrypt.compare(password, plainText);
  }
  static async addUser(username, password) {
    let result = false;

    try {
      const hashedPassword = await hashPassword(password);
      const userId = generateUserId();
      const decoded = await this.decodePassword(hashedPassword, 'password');
      console.log(decoded);
      const result = await User.create({
        username,
        password: hashedPassword,
        userid: userId
      });
      return result;
    } catch (e) {
      console.log('Failed in Service to add user');
      return result;
    }
  }
}

module.exports = UserRepository;
