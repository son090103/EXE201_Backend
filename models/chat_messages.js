'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat_messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chat_messages.belongsTo(models.Chat_rooms, {
        foreignKey: 'chat_room_id',
      });

      // Message thuộc về User
      Chat_messages.belongsTo(models.User, {
        foreignKey: 'user_id',
      });

      // 1 message có nhiều images
      Chat_messages.hasMany(models.Chat_messages_images, {
        foreignKey: 'message_id',
      });
    }
  }
  Chat_messages.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    chat_room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Chat_messages',
    tableName: 'Chat_messages',
    timestamps: true,
  });
  return Chat_messages;
};