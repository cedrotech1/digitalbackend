"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Settings", [
      { notify: "yes", createdAt: new Date(), updatedAt: new Date() },

    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Settings", null, {});
  },
};
