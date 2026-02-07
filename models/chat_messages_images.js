'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat_messages_images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chat_messages_images.belongsTo(models.Chat_messages, {
        foreignKey: 'message_id',
      });
    }
  }
  Chat_messages_images.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Chat_messages_images',
    tableName: 'Chat_messages_images',
    timestamps: true
  });
  return Chat_messages_images;
};