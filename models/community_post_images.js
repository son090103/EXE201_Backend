'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CommunityPostImage extends Model {
    static associate(models) {
      // Image → Community Post
      CommunityPostImage.belongsTo(models.CommunityPost, {
        foreignKey: 'post_id',
        as: 'post',
      });
    }
  }

  CommunityPostImage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      image_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CommunityPostImage',
      tableName: 'community_post_images',
      timestamps: false, // bảng này chỉ lưu ảnh
      underscored: true,
    }
  );

  return CommunityPostImage;
};
