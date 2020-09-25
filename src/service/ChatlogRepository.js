const ChatlogModel = require('../models/Chatlog');
const { generateRandomId } = require('../helper/index');

class ChatlogRepository {
  static async addChat(message, userId, chatroomId) {
    try {
      const result = await ChatlogModel.create({
        messageId: generateRandomId(),
        message,
        userId,
        chatroomId
      });

      return result;
    } catch (error) {
      console.log('Failed to add messages', error);
    }
  }
}

module.exports = ChatlogRepository;
