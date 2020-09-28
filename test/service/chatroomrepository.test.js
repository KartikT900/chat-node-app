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

  it('should catch error when service fails to add chatroom', async () => {
    const error = new Error('service failed');
    const chatroomModel = {
      create: jest.fn(() => {
        throw error;
      })
    };
    const consoleLogSpy = jest.spyOn(console, 'log');
    const chatroomService = new ChatroomService(chatroomModel);

    await chatroomService.addChatroom('Test');
    expect(chatroomModel.create).toBeCalledTimes(1);
    expect(chatroomModel.create).toThrow('service failed');
    expect(consoleLogSpy).toBeCalledTimes(1);
  });
});
