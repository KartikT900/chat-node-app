const bcrypt = require('bcryptjs');

//const User = require('../models/User');
const ChatroomModel = require('../models/Chatroom');
const ChatlogModel = require('../models/Chatlog');
const helpers = require('../helper');

class UserRepository {
  constructor(user) {
    this.user = user;
  }
  static async decodePassword(plainText, password) {
    return await bcrypt.compare(password, plainText);
  }
  async addUser(username, password) {
    let result = false;

    try {
      const hashedPassword = await helpers.hashPassword(password);
      const userId = helpers.generateRandomId();
      const result = await this.user.create({
        username,
        password: hashedPassword,
        userId
      });
      return result;
    } catch (e) {
      console.log('Failed in Service to add user', e);
      return result;
    }
  }

  async findUserByPk(userId) {
    try {
      const result = await this.user.findByPk(userId);
      return result;
    } catch (error) {
      console.log('Failed to fetch user details', error);
    }
  }

  async findUser(userId) {
    try {
      const result = await this.user.findOne({
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
