const bcrypt = require('bcryptjs');

const User = require('../models/User');
const ChatroomModel = require('../models/Chatroom');
const ChatlogModel = require('../models/Chatlog');
const { generateRandomId, hashPassword } = require('../helper');

class UserRepository {
  static async decodePassword(plainText, password) {
    return await bcrypt.compare(password, plainText);
  }
  static async addUser(username, password) {
    let result = false;

    try {
      const hashedPassword = await hashPassword(password);
      const userId = generateRandomId();
      const result = await User.create({
        username,
        password: hashedPassword,
        userId
      });
      return result;
    } catch (e) {
      console.log('Failed in Service to add user');
      return result;
    }
  }

  static async findUserByPk(userId) {
    return await User.findByPk(userId);
  }

  static async findUser(userId) {
    try {
      const result = await User.findOne({
        where: { userId: userId },
        include: [
          {
            model: ChatroomModel,
            as: 'chatrooms',
            through: {
              attributes: []
            }
          },
          {
            model: ChatlogModel,
            as: 'usermessages'
          }
        ]
      });

      return result;
    } catch (error) {
      console.log('Failed while querying an user', error);
    }
  }
}

module.exports = UserRepository;
