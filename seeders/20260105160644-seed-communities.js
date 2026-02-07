'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Communities', [
      {

        sport_id: 1,
        location_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {

        sport_id: 1,
        location_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {

        sport_id: 1,
        location_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {

        sport_id: 2,
        location_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {

        sport_id: 2,
        location_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {

        sport_id: 2,
        location_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {

        sport_id: 3,
        location_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {

        sport_id: 3,
        location_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {

        sport_id: 3,
        location_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
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
