'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('community_post_images', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'community_posts', // bảng posts
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // xóa post → xóa ảnh
      },

      image_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('community_post_images');
  }
};