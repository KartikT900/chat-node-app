const dotenv = require('dotenv');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, './.env') });
}

module.exports = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  dbPort: process.env.DATABASE_PORT,
  connectionString: process.env.CONNECTIONSTRING,
  databaseName: process.env.DATABASE_NAME
};
