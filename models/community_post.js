'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CommunityPost extends Model {
    static associate(models) {
      // Post → Community
      CommunityPost.belongsTo(models.Community, {
        foreignKey: 'community_id',
        as: 'community',
      });

      // Post → User
      CommunityPost.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'author',
      });

      // Post → Images
      CommunityPost.hasMany(models.CommunityPostImage, {
        foreignKey: 'post_id',
        as: 'images',
      });
    }
  }

  CommunityPost.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      community_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      post_type: {
        type: DataTypes.ENUM('log', 'question', 'share'),
        allowNull: false,
        defaultValue: 'share',
      },
    },
    {
      sequelize,
      modelName: 'CommunityPost',
      tableName: 'community_posts',
      timestamps: false,
      underscored: true, // created_at, updated_at
    }
  );

  return CommunityPost;
};
