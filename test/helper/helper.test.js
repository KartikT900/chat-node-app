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

  describe('validateString', () => {
    it.each([
      ['', false],
      ['   ', false],
      [1234, false],
      [null, false],
      [undefined, false],
      ['hello', true],
      [`template string`, true],
      ['    spaced string    ', true]
    ])('.should return $expected when string is $input', (input, expected) => {
      const testString = input;
      const valid = helpers.validateString(testString);

      expect(valid).toBe(expected);
    });
  });

  describe('validateEmail', () => {
    it.each([
      ['', false],
      [123, false],
      ['test@.com', false],
      ['test.com', false],
      ['test#123.com', false],
      ['test@test.com', true]
    ])(
      '.should return $expected when input string is $input',
      (input, expected) => {
        const testString = input;
        const valid = helpers.validateEmail(testString);

        expect(valid).toBe(expected);
      }
    );
  });
});
