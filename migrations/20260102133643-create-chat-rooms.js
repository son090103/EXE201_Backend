'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chat_rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      type_room: {
        type: Sequelize.ENUM('private', 'group'),
        allowNull: false,
      },

      // Chỉ áp dụng cho group
      visibility: {
        type: Sequelize.ENUM('public', 'private'),
        allowNull: true,
        comment: 'public: ai cũng thấy, private: chỉ invite',
      },
      // Có cho phép xin join không
      allow_join_request: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      // Chủ group
      owner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      community_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // private chat thì NULL
        references: {
          model: 'Communities',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'blocked'),
        allowNull: false,
        defaultValue: 'active',
      },

      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chat_rooms');
  }
};