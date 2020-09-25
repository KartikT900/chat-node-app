const ChatroomModel = require('../models/Chatroom');
const { generateRandomId } = require('../helper/index');

class ChatroomRepository {
  /**
   *
   * @param {string} chatroomType Describes the type of chatroom
   */
  static async addChatroom(chatroomType) {
    const result = await ChatroomModel.create({
      chatroomId: generateRandomId(),
      chatroomType
    });

    return result;
  }
}

module.exports = ChatroomRepository;
