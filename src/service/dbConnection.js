const {
  connectionString,
  databaseName,
  dbPort,
  password,
  user
} = require('../../config/config');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(databaseName, user, password, {
  host: connectionString,
  port: dbPort,
  dialect: 'postgres',
  define: {
    freezeTableName: true,
    timestamps: false
  }
});

module.exports = sequelize;
