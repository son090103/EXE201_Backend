'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Chat_rooms');
    if (!table.name) {
      await queryInterface.addColumn('Chat_rooms', 'name', {
        type: Sequelize.STRING(255),
      });
    }
  },


  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Chat_rooms');
    if (table.name) {
      await queryInterface.removeColumn('Chat_rooms', 'name');
    }
  }
};
