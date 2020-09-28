const ChatroomService = require('../../src/service/ChatroomRepository');
const helpers = require('../../src/helper');

describe('chatroomRepository', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => jest.restoreAllMocks());

  it('should add new chatroom', async () => {
    jest.spyOn(helpers, 'generateRandomId').mockReturnValue('12345');
    const chatroomModel = { create: jest.fn() };
    const chatroomService = new ChatroomService(chatroomModel);
    await chatroomService.addChatroom('Test');
    expect(chatroomModel.create).toBeCalledTimes(1);
    expect(chatroomModel.create).toBeCalledWith({
      chatroomId: '12345',
      chatroomType: 'Test'
    });
  });
});
