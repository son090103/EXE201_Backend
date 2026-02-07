'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Sport has many Communities
      Sport.hasMany(models.Community, {
        foreignKey: 'sport_id',
        as: 'Community',
      });
    }
  }

  Sport.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sport',
    tableName: 'Sports',
    timestamps: true

  });
  return Sport;
};