'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Friend.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });

      // người được kết bạn
      Friend.belongsTo(models.User, {
        foreignKey: 'friend_id',
        as: 'friend',
      });
    }

  }
  Friend.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // ⭐ composite primary key
    },

    friend_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // ⭐ composite primary key
    },

    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'blocked', 'sent'),
      defaultValue: 'pending',
    },
  }, {
    sequelize,
    modelName: 'Friend',
    tableName: 'Friends',
    timestamps: true
  });
  return Friend;
};