'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      // ===== Relations =====
      community_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Communities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      // ===== Main content =====
      title: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },

      // ===== Registration time =====
      registration_start_date: {
        type: Sequelize.DATE
      },
      registration_end_date: {
        type: Sequelize.DATE
      },

      // ===== Event time =====
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },

      // ===== Location =====
      location: {
        type: Sequelize.STRING(255)
      },
      city: {
        type: Sequelize.STRING(100)
      },

      // ===== Limit & price =====
      max_participants: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true
      },

      // ===== Privacy =====
      privacy: {
        type: Sequelize.ENUM('public', 'friends', 'private'),
        defaultValue: 'public'
      },

      // ===== Status =====
      status: {
        type: Sequelize.ENUM(
          'draft',
          'upcoming',
          'ongoing',
          'finished',
          'cancelled'
        ),
        defaultValue: 'draft'
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('events');

    // ⚠️ BẮT BUỘC: xoá enum (PostgreSQL / MySQL strict)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_events_privacy";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_events_status";'
    );
  }
};
