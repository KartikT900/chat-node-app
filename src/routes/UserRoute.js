const Router = require('express').Router;
const UserController = require('../controller/UserController');

const userRouter = new Router();

userRouter.route('/register').post(UserController.addUser);

module.exports = userRouter;
