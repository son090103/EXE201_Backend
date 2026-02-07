'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Community_Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Community_Member.belongsTo(models.User, {
        foreignKey: 'user_id',
      });

      Community_Member.belongsTo(models.Community, {
        foreignKey: 'community_id',
      });
    }
  }
  Community_Member.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    community_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'Community_Member',
    tableName: 'Community_Members',
    timestamps: true
  });
  return Community_Member;
};