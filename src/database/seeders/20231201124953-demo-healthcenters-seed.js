"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("HealthCenters", [
      { name: "Maraba Health Center", sectorId: 6, createdAt: new Date(), updatedAt: new Date() },
      { name: "Ruhashya Health Center", sectorId: 10, createdAt: new Date(), updatedAt: new Date() },
      { name: "Karama Health Center", sectorId: 3, createdAt: new Date(), updatedAt: new Date() },
      { name: "Rwaniro Health Center", sectorId: 12, createdAt: new Date(), updatedAt: new Date() },
      { name: "Kinyamakara Health Center", sectorId: 4, createdAt: new Date(), updatedAt: new Date() },
      { name: "Simbi Health Center", sectorId: 13, createdAt: new Date(), updatedAt: new Date() },
      { name: "Rusatira Health Center", sectorId: 11, createdAt: new Date(), updatedAt: new Date() },
      { name: "Busoro Health Center", sectorId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: "Mukura Health Center", sectorId: 8, createdAt: new Date(), updatedAt: new Date() },
      { name: "Huye Health Center", sectorId: 2, createdAt: new Date(), updatedAt: new Date() },
      { name: "Rubona Health Center", sectorId: 11, createdAt: new Date(), updatedAt: new Date() },
      { name: "CUSP Butare Health Center", sectorId: 9, createdAt: new Date(), updatedAt: new Date() },
      { name: "Sovu Health Center", sectorId: 2, createdAt: new Date(), updatedAt: new Date() },
      { name: "Rango Health Center", sectorId: 14, createdAt: new Date(), updatedAt: new Date() },
      { name: "Matyazo Health Center", sectorId: 9, createdAt: new Date(), updatedAt: new Date() },
      { name: "Gitovu Health Center", sectorId: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: "Kinazi Health Center", sectorId: 7, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("HealthCenters", null, {});
  },
};
