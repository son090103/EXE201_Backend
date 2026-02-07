'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      {
        name: 'ADMIN',
        description: 'Administrator',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'USER',
        description: 'Normal user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'HOST',
        description: 'host event',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    {
      ignoreDuplicates: true // tránh seed trùng
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
