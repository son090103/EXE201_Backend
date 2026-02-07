'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat_rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 1 chat room có nhiều member
      Chat_rooms.hasMany(models.Chat_rooms_users, {
        foreignKey: 'chat_room_id',
        as: 'members', // as đây là tên bí danh để dễ gọi dễ hiểu
        onDelete: 'CASCADE',
      });

      // room → messages
      Chat_rooms.hasMany(models.Chat_messages, {
        foreignKey: 'chat_room_id',
        as: 'messages',
        onDelete: 'CASCADE',
      });

      Chat_rooms.belongsTo(models.Community, {
        foreignKey: 'community_id',
        as: 'community',
      });
    }
  }

  Chat_rooms.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,

    },
    // chỉ dùng cho GROUP, private thì NULL
    type_room: {
      type: DataTypes.ENUM('private', 'group'),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM('active', 'inactive', 'blocked'),
      allowNull: false,
      defaultValue: 'active',
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    visibility: {
      type: DataTypes.ENUM('private', 'public'),
    },
    community_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Chat_rooms',
    tableName: 'Chat_rooms',
    timestamps: true
  });
  return Chat_rooms;
};