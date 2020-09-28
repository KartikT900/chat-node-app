const express = require('express');
const test = express.Router();
const UserModel = require('../models/User');
const UserRepository = require('../service/UserRepository');
const ChatroomRepository = require('../service/ChatroomRepository');
const ChatlogRepository = require('../service/ChatlogRepository');

test.get('/', async (req, res) => {
  const user = await new UserRepository(UserModel).addUser('Test1', 'password');
  const chatroom = await ChatroomRepository.addChatroom('Private');
  await user.addChatrooms(chatroom);

  res.json({ name: 'hello' });
});

test.get('/test', async (req, res) => {
  const user = await UserRepository.findUserByPk('20206755');
  const chatroom = await ChatroomRepository.addChatroom('Private');
  await chatroom.addUsers(user);
  res.json({ status: 'working' });
});

test.get('/sample', async (req, res) => {
  const user = await UserRepository.findUser('20206755');
  res.json(user);
});

test.get('/message', async (req, res) => {
  const chat = await ChatlogRepository.addChat('Hello', '20206755', '20207107');
  const user = await UserRepository.findUser('20206755');
  //user.addUsermessages(chat);
  res.json(user);
});

test.get('/sample1', (req, res) => {
  res.json({ status: 'good' });
});

module.exports = test;
