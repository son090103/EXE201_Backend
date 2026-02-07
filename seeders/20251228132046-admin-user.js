'use strict';
const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        avatar: "https://res.cloudinary.com/dmdogr8na/image/upload/v1746949468/hnrnjeaoymnbudrzs7v9.jpg",
        role_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
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
