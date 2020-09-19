const express = require('express');
const test = express.Router();

test.get('/', (req, res) => {
  res.json({ name: 'hello' });
});

test.get('/test', (req, res) => {
  res.json({ status: 'working' });
});

module.exports = test;
