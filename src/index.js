const express = require('express');
const sequelize = require('./service/dbConnection');
const UserRepository = require('./service/UserRepository');
const testRoute = require('./routes/sample');
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

app.use('/', testRoute);

app.listen(PORT, async () => {
  await dbConnect();
  console.log(`Server started on ${PORT}`);
});

module.exports = app;
