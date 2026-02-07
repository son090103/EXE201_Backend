'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Friends', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      friend_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'blocked', 'sent'),
        defaultValue: 'pending',
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

    // ⭐ composite primary key
    await queryInterface.addConstraint('Friends', {
      fields: ['user_id', 'friend_id'],
      type: 'primary key',
      name: 'pk_friends_user_friend'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Friends');
  }
};