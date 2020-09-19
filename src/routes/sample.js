const express = require('express');
const test = express.Router();

test.get('/', (req, res) => {
  res.json({ name: 'hello' });
});

module.exports = test;
