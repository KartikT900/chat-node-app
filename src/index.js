const express = require('express');
const sequelize = require('./service/dbConnection');
const testRoute = require('./routes/sample');
const PORT = 8080;

const app = express();

async function dbConnect() {
  try {
    await sequelize.authenticate();
    console.log('DB connection successful');
    await sequelize.sync();
    console.log('DB synchronization successful');
  } catch (e) {
    console.log('DB connection failed', e);
  }
}

app.use('/', testRoute);

app.listen(PORT, async () => {
  await dbConnect();
  console.log(`Server started on ${PORT}`);
});

module.exports = app;
