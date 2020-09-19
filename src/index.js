const express = require('express');
const sequelize = require('./service/dbConnection');
const UserRepository = require('./service/UserRepository');
const PORT = 8080;

const app = express();

async function dbConnect() {
  try {
    await sequelize.authenticate();
    console.log('DB connection successful');
  } catch (e) {
    console.log('DB connection failed');
  }
}

app.get('/', (req, res) => {
  UserRepository.addUser('Test', 'password');
  res.send('Hello');
});

app.listen(PORT, () => {
  dbConnect();
  console.log(`Server started on ${PORT}`);
});
