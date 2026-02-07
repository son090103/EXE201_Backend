'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Community extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Community.belongsTo(models.Sport, {
        foreignKey: 'sport_id',
        as: 'Sport',
      });

      // Community belongs to Location
      Community.belongsTo(models.Location, {
        foreignKey: 'location_id', // đang trỏ đến Location  , bên dưới tất nhiên phải có location_id rồi
        as: 'Location',
      });
    }
  }
  Community.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sport_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Community',
    tableName: "Communities",
    timestamps: true
  });
  return Community;
};