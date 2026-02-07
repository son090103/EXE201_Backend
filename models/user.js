'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //n-1
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role'
      });
      // 1-n
      User.hasMany(models.Community_Member, {
        foreignKey: 'user_id',
      });

      // 🔹 User — Community (N - N, thông qua Community_Member)
      // User.belongsToMany(models.Community, {
      //   through: models.Community_Member,
      //   foreignKey: 'user_id',
      //   otherKey: 'community_id',
      // });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
    sequelize,
    modelName: 'User',
    tableName: "Users",
    timestamps: true
  });
  return User;
};