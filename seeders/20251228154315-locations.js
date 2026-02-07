'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Locations',
      [
        {
          name: 'Hà Nội',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Đà Nẵng',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Sài Gòn',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
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
