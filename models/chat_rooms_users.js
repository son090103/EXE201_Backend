'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat_rooms_users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // N–N giữa ChatRoom và User
      Chat_rooms_users.belongsTo(models.Chat_rooms, {
        foreignKey: 'chat_room_id',
      });

      Chat_rooms_users.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
    }
  }
  Chat_rooms_users.init({

    chat_room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'member', // superAdmin / admin / member
    },
  }, {
    sequelize,
    modelName: 'Chat_rooms_users',
    tableName: 'Chat_rooms_users',
    timestamps: true
  });
  return Chat_rooms_users;
};