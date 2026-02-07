'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Many-to-many
      models.User.belongsToMany(models.Location, {
        through: Location_User,
        foreignKey: 'user_id',
        otherKey: 'location_id', // khóa này trỏ về bảng còn lại 
      });

      models.Location.belongsToMany(models.User, {
        through: Location_User,
        foreignKey: 'location_id',
        otherKey: 'user_id',
      });
    }

  }
  Location_User.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    location_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Location_User',
    tableName: "Location_Users",
    timestamps: true
  });
  return Location_User;
};