'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    static associate(models) {
      // EventImage belongs to Event
      EventImage.belongsTo(models.Event, {
        foreignKey: 'event_id',
        as: 'event'
      });
    }
  }

  EventImage.init(
    {
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      image_url: {
        type: DataTypes.STRING(255),
        allowNull: false
      },

      is_cover: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      sort_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: 'EventImage',
      tableName: 'event_images',
      underscored: true,
      timestamps: true
    }
  );

  return EventImage;
};
