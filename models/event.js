'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      // Event belongs to a Community
      Event.belongsTo(models.Community, {
        foreignKey: 'community_id',
        as: 'community'
      });

      // Event created by a User
      Event.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator'
      });
      Event.hasMany(models.EventImage, {
        foreignKey: 'event_id',
        as: 'images',
        onDelete: 'CASCADE'
      });
    };
  }

  Event.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },

      community_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      title: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      },

      registration_start_date: {
        type: DataTypes.DATE
      },
      registration_end_date: {
        type: DataTypes.DATE
      },

      start_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false
      },

      location: {
        type: DataTypes.STRING(255)
      },
      city: {
        type: DataTypes.STRING(100)
      },

      max_participants: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      // price: {
      //   type: DataTypes.DECIMAL(12, 2),
      //   allowNull: true
      // },

      privacy: {
        type: DataTypes.ENUM('public', 'friends', 'private'),
        defaultValue: 'public'
      },

      status: {
        type: DataTypes.ENUM(
          'draft',
          'upcoming',
          'ongoing',
          'finished',
          'cancelled'
        ),
        defaultValue: 'draft'
      }
    },
    {
      sequelize,
      modelName: 'Event',
      tableName: 'events',
      underscored: true, // maps created_at, updated_at
      timestamps: true
    }
  );

  return Event;
};
