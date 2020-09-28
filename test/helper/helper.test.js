const bcrypt = require('bcryptjs');
const helpers = require('../../src/helper');

describe('generateRandomId', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => jest.restoreAllMocks());
  it('generates a random ID', () => {
    const mathRandomSpy = jest.spyOn(Math, 'random');
    const todaysDate = new Date(Date.now());
    const prefix = todaysDate.getFullYear();
    const randomId = helpers.generateRandomId();
    expect(mathRandomSpy).toHaveBeenCalled();
    expect(randomId.includes(prefix)).toBeTruthy();
  });

  it('hashes a string', async () => {
    const bcryptSpy = jest.spyOn(bcrypt, 'hash');
    bcryptSpy.mockReturnValue('hashedstring');
    const hashedString = await helpers.hashPassword('abcd');

    expect(bcryptSpy).toBeCalledTimes(1);
    expect(bcryptSpy).toHaveBeenCalledWith('abcd', 10);
    expect(hashedString).toEqual('hashedstring');
  });
});
