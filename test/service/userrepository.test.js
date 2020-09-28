const UserRepository = require('../../src/service/UserRepository');
const helpers = require('../../src/helper/index');
const bcrypt = require('bcryptjs');

describe('user service', () => {
  const userModelInstanceMock = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn()
  };
  const userService = new UserRepository(userModelInstanceMock);
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => jest.restoreAllMocks());
  it('should add new user', async () => {
    const username = 'Test';
    const password = 'hashpassword';
    const userId = '12345';
    jest.spyOn(helpers, 'generateRandomId').mockReturnValue(userId);
    jest.spyOn(bcrypt, 'hash').mockReturnValue(password);
    await userService.addUser(username, password);
    expect(userModelInstanceMock.create).toBeCalledTimes(1);
    expect(userModelInstanceMock.create).toBeCalledWith({
      password,
      userId,
      username
    });
  });

  it('should fetch user details by primary key', async () => {
    await userService.findUserByPk('12345');
    expect(userModelInstanceMock.findByPk).toBeCalledTimes(1);
  });

  it('should fetch user details', async () => {
    await userService.findUser('12345');
    expect(userModelInstanceMock.findOne).toBeCalledTimes(1);
  });
});
