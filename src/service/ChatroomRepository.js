const helpers = require('../helper');

class ChatroomRepository {
  constructor(chatroomModel) {
    this.chatroomModel = chatroomModel;
  }
  /**
   *
   * @param {string} chatroomType Describes the type of chatroom
   */
  async addChatroom(chatroomType) {
    try {
      const result = await this.chatroomModel.create({
        chatroomId: helpers.generateRandomId(),
        chatroomType
      });

      return result;
    } catch (error) {
      console.log('Failed to create new chatroom', error);
    }
  }
}

module.exports = ChatroomRepository;
