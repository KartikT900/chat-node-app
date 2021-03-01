const { validateEmail, validateString } = require('../helper');

const UserModel = require('../models/User');
const UserService = require('../service/UserRepository');

class UserController {
  static async addUser(req, res) {
    const { username, email, password } = req.body;
    let isValid = validateEmail(email) && validateString(username);
    let errors = {};

    if (!isValid) {
      errors.message = 'Please enter a valid email/username';
      console.log('user input contains invalid username/email');
      res.status(400).send(errors);
      return;
    }

    const userService = new UserService(UserModel);
    const newUser = userService.addUser(email, username, password);
    if (!newUser) {
      errors.message = 'Failed in service while initiating transaction.';
      res.status(500).send({ error: errors.message });
      return;
    }
    res.status(200).send('success');
    return;
  }
}

module.exports = UserController;
