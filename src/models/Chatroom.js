const { DataTypes, Model } = require('sequelize');
const sequelize = require('../service/dbConnection');
const ChatlogModel = require('./Chatlog');

class Chatroom extends Model {}

Chatroom.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true
    },
    chatroomId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    chatroomType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'chatroom'
  }
);

Chatroom.hasMany(ChatlogModel, {
  foreignKey: 'chatroomId',
  as: 'userChatRoomMessages'
});

module.exports = Chatroom;
