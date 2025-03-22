"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("HealthCenters", [
      {
        name: "Tumba Health Center",
        sectorId: 27, // Ensure this sector exists in your Sectors table
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("HealthCenters", null, {});
  },
};
