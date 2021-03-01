const { DataTypes, Model } = require('sequelize');
const sequelize = require('../service/dbConnection');
const ChatroomModel = require('./Chatroom');
const ChatlogModel = require('./Chatlog');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'usermaster'
  }
);

User.belongsToMany(ChatroomModel, {
  through: 'userchathistory',
  as: 'chatrooms',
  foreignKey: 'userId'
});
ChatroomModel.belongsToMany(User, {
  through: 'userchathistory',
  as: 'users',
  foreignKey: 'chatroomId'
});

User.hasMany(ChatlogModel, {
  as: 'usermessages',
  constraints: false,
  foreignKey: 'userId'
});

module.exports = User;
