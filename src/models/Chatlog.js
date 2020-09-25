const { DataTypes, Model } = require('sequelize');
const sequelize = require('../service/dbConnection');

class Chatlog extends Model {}

Chatlog.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false
    },
    messageId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'chatlog'
  }
);

module.exports = Chatlog;
