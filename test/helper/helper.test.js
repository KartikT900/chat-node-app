const { generateRandomId } = require('../../src/helper/index');

describe('generateRandomId', () => {
  it('generates a random ID', () => {
    const mathRandomSpy = jest.spyOn(Math, 'random');
    const todaysDate = new Date(Date.now());
    const prefix = todaysDate.getFullYear();
    const randomId = generateRandomId();
    expect(mathRandomSpy).toHaveBeenCalled();
    expect(randomId.includes(prefix)).toBeTruthy();
  });
});
